const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["status", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const uptime = runtime(process.uptime());
        const used = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const total = (os.totalmem() / 1024 / 1024).toFixed(2);

        const status = `╭━━〔 *SANIJA-MD Alive* 〕━━
┃⏳ *Uptime:* ${uptime}
┃📟 *RAM:* ${used}MB / ${total}MB
┃⚙️ *Host:* ${os.hostname()}
┃🧬 *Version:* 1.0.1
┃👤 *Owner:* Sanija Nimtharu
╰━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/b61wmw.png' },
            caption: status,
            footer: "© 2025 Sanija MD",
            templateButtons: [
                { index: 1, quickReplyButton: { displayText: "Ping 📍", id: ".ping" }},
                { index: 2, quickReplyButton: { displayText: "System 📊", id: ".menu" }},
                { index: 3, urlButton: { displayText: "YouTube", url: "https://youtube.com/@sanijamd" }}
            ]
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply("❌ An error occurred:\n" + e.message);
    }
});
