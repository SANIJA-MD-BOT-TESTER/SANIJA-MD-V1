const { cmd } = require('../lib/command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["status", "uptime", "runtime"],
    desc: "Check system status",
    category: "main",
    react: "🔋",
    filename: __filename
}, async (conn, mek, m, {
    from, reply
}) => {
    try {
        const uptime = runtime(process.uptime());
        const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
        const hostname = os.hostname();

        const statusMsg = `╭━━〔 *🚀 SANIJA-MD IS ONLINE* 〕━━⊷
┃◈ *🕒 Uptime:* ${uptime}
┃◈ *📟 RAM:* ${usedMem} MB / ${totalMem} MB
┃◈ *⚙️ Host:* ${hostname}
┃◈ *👨‍💻 Owner:* Sanija Nimtharu
┃◈ *🧬 Version:* 1.0.1
╰━━━━━━━━━━━━━━━━━━━⊷
*© Powered by SANIJA-MD*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/b61wmw.png' }, // or use your uploaded image
            caption: statusMsg,
            footer: '⚡ Sanija MD Bot',
            buttons: [
                { buttonId: '.ping', buttonText: { displayText: 'Ping 📍' }, type: 1 },
                { buttonId: '.menu', buttonText: { displayText: 'System 📊' }, type: 1 }
            ],
            headerType: 4, // Image header
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("Alive plugin error:", err);
        reply("⚠️ Error showing system status.");
    }
});
