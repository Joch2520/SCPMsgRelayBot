exports.run = (client, editFrom, src) => {
  if (src.from.toLowerCase === "dis") {
    var text = editFrom.text;
    delete editFrom.text;
    client.editMessageText(text, editFrom)
  };

}
