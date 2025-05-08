const os = require("os");
const { runtime } = require("../lib/functions");
const { cmd } = require("../command");
const config = require("../config");

const plugin = {
  pattern: "alive",
  react: "👨‍💻",
  alias: ["test", "bot", "online"],
  desc: "Check if the bot is online and get system info.",
  category: "main",
  filename: __filename
};

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
    if (hostname.length == 12) hostname = "replit";
    else if (hostname.length == 36) hostname = "heroku";
    else if (hostname.length == 8) hostname = "koyeb";

    const uptime = runtime(process.uptime());
    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const memTotal = Math.round(os.totalmem() / 1024 / 1024);

    const msg = `👋 Hello ${pushname}, I'm *alive* now.\n\n*🚀 Version:* ${require("../package.json").version}\n*📟 Memory:* ${memUsed}MB / ${memTotal}MB\n*🕒 Uptime:* ${uptime}\n*📍 Platform:* ${hostname}\n\n🐼 Powered by *SANIJA-MD*\n🌸 Have a nice day!`;

    const image = { url: config.LOGO || "https://files.catbox.moe/b61wmw.png" };

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
      await conn.sendMessage(from, {
        image,
        caption: msg,
        footer: config.FOOTER,
        viewOnce: true
      }, { quoted: mek });
    }

  } catch (err) {
    reply("⚠️ Error occurred!");
    console.error("Alive Plugin Error:", err);
  }
});
