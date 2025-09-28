module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  credits: "Aminul Sordar (decorated from Priyansh Rajput’s base)",
  description: "Send a decorated goodbye message with random gif/photo/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "moment-timezone": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];

  const leaveFolder = join(__dirname, "cache", "leaveGif", "randomgif");
  if (!existsSync(leaveFolder)) mkdirSync(leaveFolder, { recursive: true });

  return;
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  // Skip if bot leaves
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const moment = require("moment-timezone");

  const { threadID } = event;
  const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
  const hours = parseInt(moment.tz("Asia/Dhaka").format("HH"));

  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name =
    global.data.userName.get(event.logMessageData.leftParticipantFbId) ||
    (await Users.getNameUser(event.logMessageData.leftParticipantFbId));

  const type = event.author == event.logMessageData.leftParticipantFbId ? "left by choice" : "removed by admin";

  // Decide session
  const session =
    hours <= 10
      ? "🌅 Morning"
      : hours > 10 && hours <= 12
      ? "☀️ Noon"
      : hours > 12 && hours <= 18
      ? "🌇 Evening"
      : "🌙 Night";

  // Default decorated leave message
  let msg =
    typeof data.customLeave == "undefined"
      ? `╔════•| 🌸 𝗚𝗼𝗼𝗱𝗯𝘆𝗲 𝗙𝗮𝗺 🌸 |•════╗

😔 𝗡𝗮𝗺𝗲: {name}  
🚪 𝗧𝘆𝗽𝗲: {type}  

━━━━━━━━━━━━━━━
✨ 𝗧𝗵𝗲 𝘄𝗶𝗻𝗱 𝗰𝗮𝗿𝗿𝗶𝗲𝗱 {name} 𝗮𝘄𝗮𝘆...
💭 𝗧𝗵𝗲 𝗺𝗲𝗺𝗼𝗿𝗶𝗲𝘀 𝘀𝘁𝗮𝘆 𝗯𝗲𝗵𝗶𝗻𝗱...  
━━━━━━━━━━━━━━━

⏰ {time}  
🌸 𝗪𝗶𝘀𝗵𝗶𝗻𝗴 𝘆𝗼𝘂 𝗮 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹 {session} 💐
╚════════════════════╝`
      : data.customLeave;

  // Replace placeholders
  msg = msg
    .replace(/\{name}/g, name)
    .replace(/\{type}/g, type)
    .replace(/\{session}/g, session)
    .replace(/\{time}/g, time);

  // Attachment handling
  const randomFolder = join(__dirname, "cache", "leaveGif", "randomgif");
  const files = readdirSync(randomFolder);
  let formPush;

  if (files.length > 0) {
    const randomFile = join(randomFolder, files[Math.floor(Math.random() * files.length)]);
    formPush = { body: msg, attachment: createReadStream(randomFile) };
  } else {
    formPush = { body: msg };
  }

  return api.sendMessage(formPush, threadID);
};
