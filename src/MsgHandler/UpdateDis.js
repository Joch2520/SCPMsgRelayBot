exports.run = (client, editFrom, src) => {
  const Discord = require('discord.js');
  var targetMsg = client.channels.get(editFrom.targetChan).fetchMessage(editFrom.msg_id);
  switch (editFrom.type) {
    case "normal":
      targetMsg.edit(editFrom.sender + ': ' + editFrom.content);
      break;
    case "embed":
      targetMsg.edit(editFrom.sender + ': ', {embed:editFrom.embed} );
      break;
    default:
      targetMsg.edit(editFrom.sender + ': ' + editFrom.content);
      break;
  }
}
