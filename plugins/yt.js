let apikey = 'b836d6b2292926bc';

cmd({
    pattern: "song",
    alias: ["ytmp3", "play"],
    use: ".song lelena",
    react: "🎧",
    desc: "Download audios from YouTube",
    category: "download",
    filename: __filename
},
async (conn, m, mek, { from, q, reply, prefix }) => {
    try {
        if (!q) return await reply("❌ Please enter a song name or YouTube URL!");

        const url = q.replace(/\?si=[^&]*/g, "");
        const results = await yts(url);

        if (!results?.videos?.length) return await reply("🔍 No videos found for your query!");

        const result = results.videos[0];
        const caption = `🎧 *SANIJA 𝕄𝔻 𝕐𝕋𝕄ℙ3 𝔻𝕃*\n\n` +
            `📌 *Title*: ${result.title}\n` +
            `👀 *Views*: ${result.views}\n` +
            `⏳ *Duration*: ${result.timestamp}\n` +
            `🔗 *URL*: ${result.url}\n\n` +
            `*Reply with the number*\n\n` +
            `1. Audio (MP3)\n` +
            `2. Document (MP3)`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail || config.LOGO },
            caption: caption,
            footer: config.FOOTER || "© SANIJA MD"
        }, { quoted: mek });

        const replyHandler = async (messageUpdate) => {
            const incoming = messageUpdate.messages[0];
            if (!incoming.message) return;

            if (incoming.message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id) {
                const choice = incoming.message.conversation || incoming.message.extendedTextMessage?.text;

                if (choice === '1' || choice === '2') {
                    try {
                        await conn.sendMessage(from, { react: { text: '👾', key: incoming.key } });

                        const apiUrl = `https://api-dark-shan-yt.koyeb.app/download/ytmp3_v5?url=${encodeURIComponent(result.url)}&apikey=${apikey}`;
                        const response = await fetch(apiUrl);
                        const data = await response.json();

                        if (data.status && data.data?.download) {
                            await conn.sendMessage(from, {
                                text: `⬇ *Downloading:* ${result.title}\nPlease wait...`
                            }, { quoted: incoming });

                            const cleanFileName = `${result.title}.mp3`.replace(/[^\w\s.-]/gi, '');

                            const sendOptions = {
                                mimetype: 'audio/mpeg',
                                fileName: cleanFileName,
                                quoted: incoming
                            };

                            if (choice === '1') {
                                await conn.sendMessage(from, {
                                    audio: { url: data.data.download },
                                    ...sendOptions
                                });
                            } else {
                                await conn.sendMessage(from, {
                                    document: { url: data.data.download },
                                    ...sendOptions
                                });
                            }
                        } else {
                            await reply("❌ Failed to download audio. Please try again later.");
                        }
                    } catch (error) {
                        console.error("Error handling reply:", error);
                        await reply("⚠ Error processing your request");
                    }
                }
            }
        };

        conn.ev.on('messages.upsert', replyHandler);

        const handlerRef = { handler: replyHandler };
        conn.songHandlers = conn.songHandlers || {};
        conn.songHandlers[sentMsg.key.id] = handlerRef;

        setTimeout(() => {
            if (conn.songHandlers[sentMsg.key.id]) {
                conn.ev.off('messages.upsert', conn.songHandlers[sentMsg.key.id].handler);
                delete conn.songHandlers[sentMsg.key.id];
            }
        }, 300000); // 5 minutes

    } catch (e) {
        console.error(e);
        await reply("⚠ Error! Failed to process your request.");
    }
});
