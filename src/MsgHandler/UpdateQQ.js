exports.run = (client, deleted, resent, src) => {
  const path = require("path");
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  let DToQMap = MsgMap.prepare("INSERT OR REPLACE INTO FromDis (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");
  let TToQMap = MsgMap.prepare("INSERT OR REPLACE INTO FromTel (TelMsgID, QQMsgID) VALUES (@TelMsgID, @QQMsgID);");

  client('delete_msg', deleted).then(
    client('send_group_msg', resent).then(res=>{
      if (src.from.toLowerCase() === "dis") {
        DToQMap.run({DisMsgID:src.id, QQMsgID:res.message_id.toString(10)});
      } else if (src.from.toLowerCase() === "tel") {
        TToQMap.run({TelMsgID:src.id.toString(10), QQMsgID:res.message_id.toString(10)});
      }
    })
  ).catch(e=>{console.log(e)})
}
