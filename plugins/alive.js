// Import necessary modules
const os = require("os");
const { cmd } = require("../command");  // Ensure this is the correct path for your `cmd` function
const { runtime } = require("../lib/functions");  // Adjust this path as necessary
const config = require("../config");

// Define the plugin object
const plugin = {
  pattern: "alive",
  react: "👨‍💻",
  alias: ["online", "test", "bot"],
  desc: "Check if the bot is online and get system info.",
  category: "main",
  filename: __filename
};

// Register the command using the cmd function
cmd(plugin, async (conn, mek, m, {
  from,
  prefix,
  l,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    let hostname = os.hostname();
    
    // Check for platform names based on the hostname
    if (hostname.length == 12) hostname = "replit";
    else if (hostname.length == 36) hostname = "heroku";
    else if (hostname.length == 8) hostname = "koyeb";

    // Get uptime and memory usage
    const uptime = runtime(process.uptime());
    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const memTotal = Math.round(os.totalmem() / 1024 / 1024);

    // Create the message
    const msg = `👋 Hello ${pushname}, I'm *alive* now.\n\n*🚀 Version:* ${require("../package.json").version}\n*📟 Memory:* ${memUsed}MB / ${memTotal}MB\n*🕒 Uptime:* ${uptime}\n*📍 Platform:* ${hostname}\n\n🐼 Powered by *SANIJA-MD*\n🌸 Have a nice day!`;

    // Define the image to send with the message
    const image = { url: config.LOGO || "https://files.catbox.moe/b61wmw.png" };

    // Choose between sending a button message or a list message
    if (config.MODE === "button") {
      const buttons = [
        { buttonId: prefix + "menu", buttonText: { displayText: "MENU" } },
        { buttonId: prefix + "ping", buttonText: { displayText: "PING" } }
      ];
      await conn.sendMessage(from, {
        image,
        caption: msg,
        footer: config.FOOTER,
        buttons,
        headerType: 4,
        viewOnce: true
      }, { quoted: mek });
    } else {
      const sections = [{
        title: "Choose an option",
        rows: [
          { title: "📖 Menu", rowId: prefix + "menu", description: "Command Menu" },
          { title: "📍 Ping", rowId: prefix + "ping", description: "Check Bot Speed" }
        ]
      }];
      await conn.replyList(from, {
        image,
        caption: msg,
        footer: config.FOOTER,
        buttonText: "Select an option",
        sections
      }, { quoted: mek });
    }
    
  } catch (err) {
    // Handle any errors
    reply("⚠️ Error occurred!");
    console.error("Alive Plugin Error:", err);
  }
});
