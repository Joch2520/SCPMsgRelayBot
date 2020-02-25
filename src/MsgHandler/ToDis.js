exports.run = (client, disMsg, src) => {
  const Discord = require('discord.js');
  const path = require('path');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let QToDMap = MsgMap.prepare("INSERT OR REPLACE INTO FromQQ (QQMsgID, DisMsgID) VALUES (@QQMsgID, @DisMsgID);");
  let TToDMap = MsgMap.prepare("INSERT OR REPLACE INTO FromTel (TelMsgID, DisMsgID) VALUES (@TelMsgID, @DisMsgID);");

  var targetDisChan = disMsg.targetChan;

  if (disMsg.type === "embed") {
    targetDisChan.send(disMsg.sender + ': ', {files:disMsg.files, embed:disMsg.embed} )
    .then(message => { if (src.from.toLowerCase() === "qq") {
        QToDMap.run({QQMsgID:src.id.toString(10), DisMsgID:message.id});
      } else if (src.from.toLowerCase() === "tel") {
        TToDMap.run({TelMsgID:src.id.toString(10), DisMsgID:message.id});
      }});
  } else if (disMsg.type === "normal") {
    targetDisChan.send(disMsg.sender + ': ' + disMsg.content, {files:disMsg.files})
    .then(message => { if (src.from.toLowerCase() === "qq") {
        QToDMap.run({QQMsgID:src.id.toString(10), DisMsgID:message.id});
      } else if (src.from.toLowerCase() === "tel") {
        TToDMap.run({TelMsgID:src.id.toString(10), DisMsgID:message.id});
      }});
  }
}
