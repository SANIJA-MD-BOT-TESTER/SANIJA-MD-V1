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
       const status = `╭━━〔 *(◕‿↼) 𝓢𝓐𝓝𝓘𝓙𝓐-𝓜𝓓-𝓿1* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *⏳ Uptime*:  ${runtime(process.uptime())} 
┃◈┃• *📟 Ram Usage*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
┃◈┃• *⚙️ Host Name*: ${os.hostname()}
┃◈┃• *👨‍💻 Owner*: Sanija Nimtharu
┃◈┃• *🧬 Version*: 1.0.1
┃◈└───────────┈⊷
╰──────────────┈⊷
> *© Powered By SANIJA MD*`;

        if (config.BUTTON === 'true') {
            await conn.sendMessage(from, {
                footer: '© 2025 SANIJA MD',
                buttons: [
                    {
                        buttonId: '.system',
                        buttonText: { displayText: 'System 📟' },
                        type: 1
                    },
                    {
                        buttonId: '.ping',
                        buttonText: { displayText: 'Ping 📍' },
                        type: 1
                    }
                ],
                headerType: 1,
                viewOnce: true,
                image: { url: "https://files.catbox.moe/b61wmw.png" },
                caption: status,
                contextInfo: {
                    isForwarded: true,
                    mentionedJid: [m.sender],
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363296974282444@newsletter",
                        newsletterName: "SANIJA-MD"
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
