exports.run = (clients, msg) => {
  const path = require("path");
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  let pref = clients.config.CMD_PREFIX.toLowerCase();
  var QQ = clients.qq;

  if (msg.content.toLowerCase().startsWith(pref)) return;
  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM FromDis WHERE DisMsgID = ?').get(msg.id);
  if (QQMsgID.QQMsgID) {
    var deleted = {message_id: parseInt(QQMsgID.QQMsgID)};
    QQ('delete_msg',deleted)
    {
      MsgMap.prepare('DELETE FROM FromDis WHERE DisMsgID = ?').run(msg.id);
    }
  }
}
