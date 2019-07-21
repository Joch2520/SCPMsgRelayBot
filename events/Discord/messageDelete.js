exports.run = (client, msg) => {
  const fs = require("fs");
  const path = require("path");
  const app = require('express');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite('./../data/MsgMappings.sqlite');
  let pref = JSON.parse(fs.readFileSync('./config.json', 'utf8')).prefix.toLowerCase();

  if (msg.content.toLowerCase().startsWith(pref)) return;
  let QQMsgID = MsgMap.run('SELECT QQMsgID FROM DisToCQ WHERE DisMsgID = ?', msg.id);
  if (QQMsgID) {
    var deleted = {"message_id":""};
    deleted.message_id = QQMsgID;
    app.get('/delete_msg?json='+encodeURI(JSON.stringify(deleted)));
    MsgMap.run('DELETE FROM DisToCQ WHERE DisMsgID = ?', msg.id);
  }
}
