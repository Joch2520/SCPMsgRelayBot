exports.run = (client, msg) => {
  const fs = require("fs");
  const path = require("path");
  const app = require('express');
  let pref = JSON.parse(fs.readFileSync('./config.json', 'utf8')).prefix.toLowerCase();
  if (msg.content.toLowerCase().startsWith(pref)) return;
  let MsgIDs = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/MsgIDs.json'), 'utf8'));
  if (MsgIDs.DisToCQ.hasOwnProperty(msg.id)) {
    var deleted = {"message_id":""};
    deleted.message_id = MsgIDs.DisToCQ[msg.id];
    app.get('/delete_msg?json='+encodeURI(JSON.stringify(deleted)));
    delete MsgIDs.DisToCQ[msg.id];
  }
}
