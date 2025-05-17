const { cmd, commands } = require('../command');
const yts = require('yt-search');
const yasiya = require('@dark-yasiya/scrap'); // Importing @dark-yasiya/scrap for downloading

cmd({
  pattern: "video",
  desc: "Download videos from YouTube.",
  category: "download",
  react: '🎥',
  filename: __filename
}, async (messageHandler, context, quotedMessage, { from, reply, q }) => {
  try {
    if (!q) return reply("*Please Provide A Video Title or URL 🙄*");

    // Search for the videos using yt-search
    const searchResults = await yts(q);
    if (!searchResults || searchResults.videos.length === 0) {
      return reply("*No Videos Found Matching Your Query 🧐*");
    }

    let videoListMessage = `*ＹＯＵＴＵＢＥ ＶＩＤＥＯ ＳＥＡＲＣＨ ＲＥＳＵＬＴＳ*\n\n`;
    searchResults.videos.slice(0, 5).forEach((video, index) => {
      videoListMessage += `*${index + 1}.* ${video.title} - ${video.timestamp}\n`;
    });

    videoListMessage += `\n*Reply with the number of the video you want to download (1-5).*`;

    // Send the list of videos
    const sentMessage = await messageHandler.sendMessage(from, {
      caption: videoListMessage,
    }, { quoted: quotedMessage });

    // Listen for user's reply to select the video number
    messageHandler.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.extendedTextMessage) return;

      const userReply = message.message.extendedTextMessage.text.trim();
      const selectedVideoIndex = parseInt(userReply) - 1;

      if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
        if (selectedVideoIndex >= 0 && selectedVideoIndex < 5) {
          const selectedVideo = searchResults.videos[selectedVideoIndex];
          const videoUrl = selectedVideo.url;

          // Using @dark-yasiya/scrap to fetch the download link
          const result = await yasiya.video(videoUrl); // Download video using @dark-yasiya/scrap
          const downloadLink = result.download_url; // Get the download URL

          let videoDetailsMessage = `*ＹＯＵＴＵＢＥ ＶＩＤＥＯ ＤＬ*\n\n`;
          videoDetailsMessage += `*⚜ Title:* ${selectedVideo.title}\n`;
          videoDetailsMessage += `*👀 Views:* ${selectedVideo.views}\n`;
          videoDetailsMessage += `*⏰ Duration:* ${selectedVideo.timestamp}\n`;
          videoDetailsMessage += `*📆 Uploaded:* ${selectedVideo.ago}\n`;
          videoDetailsMessage += `*📽 Channel:* ${selectedVideo.author.name}\n`;
          videoDetailsMessage += `*🖇 URL:* ${selectedVideo.url}\n\n`;
          videoDetailsMessage += `*Choose Your Download Format:*\n\n`;
          videoDetailsMessage += `1 || Video File 🎬\n`;
          videoDetailsMessage += `2 || Document File 📂\n\n`;
          videoDetailsMessage += `> SANIJA MD®`;

          // Send the video thumbnail with video details
          const sentVideoMessage = await messageHandler.sendMessage(from, {
            image: { url: selectedVideo.thumbnail },
            caption: videoDetailsMessage,
          }, { quoted: quotedMessage });

          // Listen for the user's reply to select the download format
          messageHandler.ev.on("messages.upsert", async (update) => {
            const message = update.messages[0];
            if (!message.message || !message.message.extendedTextMessage) return;

            const userDownloadReply = message.message.extendedTextMessage.text.trim();

            // Handle the download format choice
            if (message.message.extendedTextMessage.contextInfo.stanzaId === sentVideoMessage.key.id) {
              switch (userDownloadReply) {
                case '1': // Video File
                  await messageHandler.sendMessage(from, {
                    video: { url: downloadLink },
                    mimetype: "video/mp4"
                  }, { quoted: quotedMessage });
                  break;
                case '2': // Document File
                  await messageHandler.sendMessage(from, {
                    document: { url: downloadLink },
                    mimetype: 'video/mp4',
                    fileName: `${selectedVideo.title}.mp4`,
                    caption: `${selectedVideo.title}\n\n> SANIJA MD®`
                  }, { quoted: quotedMessage });
                  break;
                default:
                  reply("*Invalid Option. Please Select A Valid Option 🙄*");
                  break;
              }
            }
          });
        } else {
          reply("*Invalid Video Number. Please Reply with a Number Between 1 and 5 🙄*");
        }
      }
    });
  } catch (error) {
    console.error(error);
    reply("*An Error Occurred While Processing Your Request 😔*");
  }
});
