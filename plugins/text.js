cmd({
    pattern: "testbtn",
    desc: "Test buttons",
    category: "test",
    filename: __filename
}, async (conn, m, mek, { from }) => {
    await conn.sendMessage(from, {
        text: "Button test",
        footer: "Choose an option",
        templateButtons: [
            { index: 1, quickReplyButton: { displayText: "Hello 👋", id: ".alive" } },
            { index: 2, quickReplyButton: { displayText: "Ping 🏓", id: ".ping" } }
        ]
    }, { quoted: mek });
});
