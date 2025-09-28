module.exports.config = {
    name: "help",
    version: "3.0",
    hasPermssion: 0,
    credits: "Modified by Aminul",
    description: "Show all commands or detailed command info with stylish decoration",
    commandCategory: "System",
    usages: "help [page] / help [command_name]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const commands = Array.from(global.client.commands.values());
        const prefix = global.client.config?.PREFIX || "!";
        const totalCommands = commands.length;
        const perPage = 20;
        const totalPages = Math.ceil(totalCommands / perPage);

        // ========== If user asked for a specific command ==========
        if (args[0] && isNaN(args[0])) {
            const commandName = args[0].toLowerCase();
            const cmdFound = commands.find(cmd => {
                if (cmd.config.name.toLowerCase() === commandName) return true;
                if (cmd.config.aliases && cmd.config.aliases.some(a => a.toLowerCase() === commandName)) return true;
                return false;
            });

            if (!cmdFound) return api.sendMessage(`❌ Command '${args[0]}' not found.`, event.threadID);

            const detail = `
╔═════•| 📘 |•═════╗
       COMMAND INFO
╚═════•| 📘 |•═════╝

🔹 Name: ${cmdFound.config.name}
💬 Description: ${cmdFound.config.description || "No description"}
🛠 Usage: ${prefix}${cmdFound.config.usages || cmdFound.config.name}
📂 Category: ${cmdFound.config.commandCategory || "Other"}
🏷 Credits: ${cmdFound.config.credits || "Unknown"}
🔑 Permission: ${cmdFound.config.hasPermssion || 0}
⏱ Cooldown: ${cmdFound.config.cooldowns || 0}s

━❮🖤❯━━━❪🕊️❫━━━❮🩷❯━
「 MIRAI PROJECT 」
`;
            return api.sendMessage(detail, event.threadID);
        }

        // ========== If user asked for page or just help ==========
        let page = parseInt(args[0]) || 1;
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        const start = (page - 1) * perPage;
        const end = start + perPage;
        const list = commands.slice(start, end);

        let msg = `╔═════•| 💜 |•═════╗\n`;
        msg += `        𝐌𝐈𝐑𝐀𝐈 𝐏𝐑𝐎𝐉𝐄𝐂𝐓\n`;
        msg += `╚═════•| 💜 |•═════╝\n\n`;

        msg += `📜 𝐏𝐀𝐆𝐄 ${page}/${totalPages} 📜\n\n`;
        msg += ` ━❮🖤❯━━━❪🕊️❫━━━❮🩷❯━\n`;

        list.forEach((cmd, i) => {
            msg += `│ ▪ ${start + i + 1} ➩ ${cmd.config.name}\n`;
        });

        msg += ` ━❮🖤❯━━━❪🕊️❫━━━❮🩷❯━\n\n`;

        msg += `📌 How To Make Free This Bot:\n👉 Facebook.com/100071880593545\n\n`;
        msg += `🅞𝐖𝐍𝐄𝐑 🅑𝐨𝐭 🙊😝\n👉 m.me/100071880593545\n\n`;
        msg += `━❮🖤❯━━━❪🕊️❫━━━❮🩷❯━`;

        return api.sendMessage(msg, event.threadID);

    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ An error occurred while fetching help menu.", event.threadID);
    }
};
