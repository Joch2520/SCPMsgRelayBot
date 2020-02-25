exports.run = (client, receive, src) => {
  const path = require("path");
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let DToTMap = MsgMap.prepare("INSERT OR REPLACE INTO FromDis (DisMsgID, TelMsgID) VALUES (@DisMsgID, @TelMsgID);");
  let QToTMap = MsgMap.prepare("INSERT OR REPLACE INTO FromQQ (QQMsgID, TelMsgID) VALUES (@QQMsgID, @TelMsgID);");

  client.sendMessage(receive).then( msg => {if (src.from.toLowerCase === "qq") {
      QToTMap.run({QQMsgID:src.id.toString(10), TelMsgID:msg.message_id.toString(10)});
    } else if (src.from.toLowerCase === "dis") {
      DToTMap.run({DisMsgID:src.id, TelMsgID:msg.message_id.toString(10)});
    }
  })

}
