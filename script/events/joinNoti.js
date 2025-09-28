module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.2",
    credits: "Modified & Decorated by Aminul Sardar",
    description: "Stylish notification when bot or members join with random gif/video",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "joinvideo");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    const path2 = join(__dirname, "cache", "joinvideo", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
};

module.exports.run = async function ({ api, event }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;

    // If the bot itself is added
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "AminulBot"}`, threadID, api.getCurrentUserID());
        const fs = require("fs");

        return api.sendMessage("", event.threadID, () =>
            api.sendMessage({
                body: `🍒💙••• BOT CONNECTED •••💞🌿
                
🕊️🌸...Hello Everyone!  
My Name is ✦ AminulBot ✦ 🤖💙  

✨💞 My Prefix is: 【 ${global.config.PREFIX} 】  

💎 Example Commands:  
${global.config.PREFIX}quote (text) 💬  
${global.config.PREFIX}photo (image) 🌿🌊  
${global.config.PREFIX}help2 (all commands) 📖  
${global.config.PREFIX}info (admin info) 👑  

🌸 Contact & Info:  
👑 Owner: Aminul Sardar  
📘 Facebook: www.facebook.com/100071880593545  
💬 Telegram: @AminulSordar  

✮☸✮
✮┼💞┼✮
☸🕊️━━•🌸•━━🕊️☸
✮┼🍫┼✮
☸🎀━━•🤍•━━🎀☸
✮┼🦢┼✮
☸🌈━━•✨•━━🌈☸
✮☸✮

┏━🕊️━━°❀• AminulBot •❀°━━💞━┓  
┗━🕊️━━°❀• Owner: Aminul Sardar •❀°━━💞━┛
`,
                attachment: fs.createReadStream(__dirname + "/cache/botjoin.mp4")
            }, threadID)
        );
    }

    // If new members join
    else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);

            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joinvideo");
            const pathGif = join(path, `${threadID}.video`);

            let mentions = [], nameArray = [], memLength = [], i = 0;

            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }
            memLength.sort((a, b) => a - b);

            let msg = (typeof threadData.customJoin == "undefined") ?
                `🌸✨ Welcome {name}! ✨🌸  

───────────────────────  
🎀 You are the {soThanhVien} member of ✦ {threadName} ✦  
───────────────────────  

💫 Please enjoy your stay here!  
🤝 Make new {type}, share love & happiness 💙  

👑 Powered by AminulBot  
💎 Owner: Aminul Sardar  
───────────────────────  
` : threadData.customJoin;

            msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? 'friends' : 'friend')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            if (existsSync(path)) mkdirSync(path, { recursive: true });

            const randomPath = readdirSync(join(__dirname, "cache", "joinvideo", "randomgif"));

            let formPush;
            if (existsSync(pathGif)) {
                formPush = { body: msg, attachment: createReadStream(pathGif), mentions };
            } else if (randomPath.length != 0) {
                const pathRandom = join(__dirname, "cache", "joinvideo", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions };
            } else {
                formPush = { body: msg, mentions };
            }

            return api.sendMessage(formPush, threadID);
        } catch (e) { return console.log(e) };
    }
};
