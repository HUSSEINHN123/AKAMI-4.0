module.exports.config = {
    name: "info",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Structured by Aminul",
    description: "Show full Bot & Admin Information in a decorated style",
    commandCategory: "System",
    cooldowns: 3,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async function ({ api, event }) {
    const axios = global.nodemodule["axios"];
    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs-extra"];

    // Bot uptime calculation
    const time = process.uptime(),
        hours = Math.floor(time / (60 * 60)),
        minutes = Math.floor((time % (60 * 60)) / 60),
        seconds = Math.floor(time % 60);

    // Date/Time formatting
    const moment = require("moment-timezone");
    const formattedDate = moment.tz("Asia/Dhaka").format("📅 DD/MM/YYYY | ⏰ HH:mm:ss");

    // Random banner images
    const banners = [
        "https://i.imgur.com/H2E0nDE.jpg",
        "https://i.imgur.com/twLg8cO.jpg",
        "https://i.imgur.com/RBqvLJw.jpg",
        "https://i.imgur.com/7FkW2hF.jpg"
    ];

    // Build decorated message
    const message = `
╔═════•| ✨ |•═════╗
       🌟 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 🌟
╚═════•| ✨ |•═════╝

📌 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━━━
🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${global.config.BOTNAME}
👑 𝗢𝘄𝗻𝗲𝗿: ${global.config.OWNER || global.config.ADMINBOT.join(", ")}
💠 𝗣𝗿𝗲𝗳𝗶𝘅: ${global.config.PREFIX}

📊 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦
━━━━━━━━━━━━━━━━━
🕒 𝗨𝗽𝘁𝗶𝗺𝗲: ${hours}h ${minutes}m ${seconds}s
📅 𝗧𝗼𝗱𝗮𝘆: ${formattedDate}

🛡️ 𝗔𝗗𝗠𝗜𝗡 𝗧𝗘𝗔𝗠
━━━━━━━━━━━━━━━━━
${global.config.ADMINBOT.map((id, i) => `${i + 1}. ${id}`).join("\n")}

💡 𝗡𝗢𝗧𝗘
━━━━━━━━━━━━━━━━━
⚠️ Please use the bot responsibly  
💖 Don’t spam, keep the system healthy

╔═════•| 🌐 |•═════╗
   𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗔𝗺𝗶𝗻𝘂𝗹  
╚═════•| 🌐 |•═════╝
`;

    // Final callback
    const callback = () => api.sendMessage({
        body: message,
        attachment: fs.createReadStream(__dirname + "/cache/info.jpg")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/info.jpg"));

    // Download random banner
    return request(encodeURI(banners[Math.floor(Math.random() * banners.length)]))
        .pipe(fs.createWriteStream(__dirname + "/cache/info.jpg"))
        .on("close", () => callback());
};
