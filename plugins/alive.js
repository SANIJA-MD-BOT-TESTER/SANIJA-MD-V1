const { cmd, commands } = require('../command');
const fs = require('fs');
const config = require('../config');

cmd({
    pattern: "alive",
    desc: "Bot's Online or No.",
    react: "👋",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const uptime = process.uptime(); // in seconds
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const timeNow = new Date().toLocaleTimeString('en-US', { hour12: true });

        const aliveMessage = `👑 SANIJA MD Is Online 🌚

⏱ Uptime: ${hours}h ${minutes}m ${seconds}s
🕒 Time: ${timeNow}
✨ Status: I'm alive and working!`;

        if (config.BUTTON === 'true') {
            await conn.sendMessage(from, {
                footer: '© 2025 SANIJA MD',
                buttons: [
                    {
                        buttonId: '.system',
                        buttonText: { displayText: '.System ' },
                        type: 1
                    },
                    {
                        buttonId: '.ping',
                        buttonText: { displayText: '.Ping ' },
                        type: 1
                    }
                ],
                headerType: 1,
                viewOnce: true,
                image: { url: "https://files.catbox.moe/b61wmw.png" },
                caption: aliveMessage,
                contextInfo: {
                    isForwarded: true,
                    mentionedJid: [m.sender],
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363296974282444@newsletter",
                        newsletterName: "SANIJA MD"
                    }
                }
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, {
                image: { url: "https://files.catbox.moe/b61wmw.png" },
                caption: aliveMessage
            }, { quoted: mek });
        }
    } catch (e) {
        console.log(e);
        reply("*ERROR ❗❗*");
    }
});
