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

    if (shareEmbed) {
      targetChan.send(transName + ': ', {embed:shareEmbed} )
      .then(message => {
        QToDMap.run({QQMsgID:src.id.toString(10), DisMsgID:message.id});
      });
    } else {
      targetChan.send(transName + ': ' + transMsg)
      .then(message => {
        QToDMap.run({QQMsgID:src.id.toString(10), DisMsgID:message.id});
      });
    }

  } else if (receive.from === "Tel") {

  }
}
