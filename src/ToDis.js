exports.run = (client, receive, src) => {
  const Discord = require('discord.js');
  const SQLite = require('better-sqlite3');
  const Transcoder = require('./../lib/Transcoder.js');
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let QToDMap = MsgMap.prepare("INSERT OR REPLACE INTO FromQQ (QQMsgID, DisMsgID) VALUES (@QQMsgID, @DisMsgID);");
  let TToDMap = MsgMap.prepare("INSERT OR REPLACE INTO FromTel (TelMsgID, DisMsgID) VALUES (@TelMsgID, @DisMsgID);");


  if (receive.from === "QQ") {

    if (receive.type === "embed") {
      receive.targetChan.send(receive.sender + ': ', {embed:receive.embed} )
      .then(message => {
        QToDMap.run({QQMsgID:src.id.toString(10), DisMsgID:message.id});
      });
    } else if (receive.type === "normal") {
      receive.targetChan.send(receive.sender + ': ' + content)
      .then(message => {
        QToDMap.run({QQMsgID:src.id.toString(10), DisMsgID:message.id});
      });
    }

  } else if (receive.from === "Tel") {

    if (receive.type === "embed") {
      receive.targetChan.send(receive.sender + ': ', {embed:receive.embed} )
      .then(message => {
        TToDMap.run({TelMsgID:src.id.toString(10), DisMsgID:message.id});
      });
    } else if (receive.type === "normal") {
      receive.targetChan.send(receive.sender + ': ' + content)
      .then(message => {
        TToDMap.run({TelMsgID:src.id.toString(10), DisMsgID:message.id});
      });
    }
  }
}
