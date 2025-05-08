const os = require("os");
const { runtime } = require("../lib/functions"); // Assuming runtime formats uptime
const config = require("../config");

const alivePlugin = {
  pattern: "alive", // Trigger command
  react: "👨‍💻",    // Reaction emoji
  alias: ["online", "test", "bot"], // Aliases
  desc: "Check if the bot is online and get system info.",
  category: "main", // Category
  filename: __filename
};

// Command handler
cmd(alivePlugin, async (conn, mek, m, { 
  from, prefix, pushname, reply 
}) => {
  try {
    // Determine the platform the bot is running on
    let hostname = os.hostname();
    if (hostname.length === 12) hostname = "replit";
    else if (hostname.length === 36) hostname = "heroku";
    else if (hostname.length === 8) hostname = "koyeb";
    
    // Format the uptime, memory usage, and version
    const message = `👋 Hello ${pushname}, I'm *alive* now.\n\n*🚀 Version:* ${require("../package.json").version}\n*📟 Memory:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem() / 1024 / 1024)}MB\n*🕒 Uptime:* ${runtime(process.uptime())}\n*📍 Platform:* ${hostname}\n\n🐼 Powered by SANIJA-MD\n🌸 Have a nice day!`;

    // Send the loading steps to simulate a loading state
    const loadingSteps = ["LOADING ●●○○○○", "LOADING ●●●●○○", "LOADING ●●●●●●", "`COMPLETED ✅`"];
    const { key } = await conn.sendMessage(from, { text: loadingSteps[0] });

    for (let i = 1; i < loadingSteps.length; i++) {
      await conn.sendMessage(from, { text: loadingSteps[i], edit: key });
    }

    // Send response with buttons (or menu)
    if (config.MODE === "nonbutton") {
      // Menu configuration for non-button mode
      const sections = [{
        title: 'Select an Option',
        rows: [
          { title: '1', rowId: prefix + "menu", description: "Command Menu" },
          { title: '2', rowId: prefix + "ping", description: "Check Bot Speed" }
        ]
      }];
      const image = { url: config.ALIVE_IMG };
      const replyMessage = {
        caption: message,
        image,
        footer: config.BOT_NAME,
        buttonText: "*🔢 Reply below number*",
        sections
      };
      await conn.replyList(from, replyMessage, { quoted: mek });
    } else if (config.MODE === "button") {
      // Button configuration for button mode
      const image = { url: config.ALIVE_IMG };
      const buttons = [
        { buttonId: prefix + "menu", buttonText: { displayText: "MENU" } },
        { buttonId: prefix + "ping", buttonText: { displayText: "PING" } }
      ];
      const buttonMessage = {
        image,
        caption: message,
        footer: config.BOT_NAME,
        buttons,
        headerType: 1,
        viewOnce: true
      };
      await conn.sendMessage(from, buttonMessage, { quoted: mek });
    }
  } catch (error) {
    // Handle any errors
    reply("⚠️ *Error occurred!*");
    console.error(error);
  }
});
