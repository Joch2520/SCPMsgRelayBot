exports.run = (clients, msg) => {
  const fs = require("fs");
  const path = require("path");
  const request = require('request');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../../data/MsgMappings.sqlite'));
  let pref = JSON.parse(fs.readFileSync(path.join(__dirname,'../../../data/config.json'), 'utf8')).prefix.toLowerCase();

  if (msg.content.toLowerCase().startsWith(pref)) return;
  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM FromDis WHERE DisMsgID = ?').get(msg.id);
  if (QQMsgID.QQMsgID) {
    var deleted = {message_id: parseInt(QQMsgID.QQMsgID)};
    clients.qq('delete_msg',deleted)
    {
      MsgMap.prepare('DELETE FROM FromDis WHERE DisMsgID = ?').run(msg.id);
    }
  }
}
