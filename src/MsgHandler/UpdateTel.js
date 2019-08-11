exports.run = (client, editFrom, src) => {
  const Telegram = require("node-telegram-bot-api");
  if (src.from.toLowerCase === "dis") {
    var text = editFrom.text;
    delete editFrom.text;
    client.editMessageText(text, editFrom);
  };
}
