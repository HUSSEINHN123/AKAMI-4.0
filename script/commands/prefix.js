module.exports.config = {
  name: "prefix",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "abir", // do not change credits
  description: "Show the bot's prefix",
  commandCategory: "System",
  usages: "prefix",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  const { threadID, messageID, body } = event;

  // Protect credits
  if (this.config.credits !== "abir") {
    return api.sendMessage("⚠️ Credits have been changed!", threadID, messageID);
  }

  const triggerWords = [
    "mpre","mprefix","prefix",
    "dấu lệnh","prefix của bot là gì",
    "daulenh","duong"
  ];

  const check = triggerWords.some(word => {
    let str = word[0].toUpperCase() + word.slice(1);
    return body === word || body === word.toUpperCase() || body === str;
  });

  if (!check) return;

  const threadData = await Threads.getData(threadID);
  const data = threadData.data || {};
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = data.PREFIX || threadSetting.PREFIX || global.config.PREFIX;

  return api.sendMessage(
`➽────────────────❥
🌟 Bot Prefix Information 🌟

💫 Current Prefix: [ ${prefix} ]
🔧 Usage: Type "${prefix}help" to see all commands
👑 Bot by: @Aminusardar
🔗 Facebook: https://www.facebook.com/100071880593545
🎯 Enjoy using the bot! 💖
➽────────────────❥`,
    threadID,
    messageID
  );
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage(
`➽────────────────❥
🌟 Bot Prefix Information 🌟

💫 Current Prefix: [ ${global.config.PREFIX} ]
🔧 Usage: Type "${global.config.PREFIX}help" to see all commands
👑 Bot by: @Aminusardar
🔗 Facebook: https://www.facebook.com/100071880593545
🎯 Enjoy using the bot! 💖
➽────────────────❥`,
    event.threadID
  );
};
