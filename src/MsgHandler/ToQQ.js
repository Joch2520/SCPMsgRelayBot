exports.run = (client, receive, src) => {
  const path = require("path");
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let DToQMap = MsgMap.prepare("INSERT OR REPLACE INTO FromDis (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");
  let TToQMap = MsgMap.prepare("INSERT OR REPLACE INTO FromTel (TelMsgID, QQMsgID) VALUES (@TelMsgID, @QQMsgID);");

  if (src.from.toLowerCase() === "dis") {
    client('send_group_msg',receive).then(res => {
      if (src.from === "dis") {
        DToQMap.run({DisMsgID:src.id, QQMsgID:res.message_id.toString(10)});
      } else if (src.from === "tel") {
        TToQMap.run({TelMsgID:src.id.toString(10), QQMsgID:res.message_id.toString(10)});
      }
    })
  };
}
