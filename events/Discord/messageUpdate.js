exports.run = (client, oldMsg, newMsg) => {
  const fs = require("fs");
  const path = require("path");
  const request = require('request');
  const SQLite = require('better-sqlite3');
  var DQT = require('./../lib/DQTranscoder.js');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/channelMapping.json'), 'utf8'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let setMsgMap = MsgMap.prepare("INSERT OR REPLACE INTO DisToCQ (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");

  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM DisToCQ WHERE DisMsgID = ?').get(oldMsg.id);
  if (QQMsgID) {
    var deleted = {"message_id":""};
    deleted.message_id = QQMsgID.QQMsgID;
    var CQMsg = { "group_id":"", "message":"" }
    CQMsg.group_id = chanMap.QQGPID[chanMap.DisChanID.indexOf(oldMsg.channel.id)];
    CQMsg.message = '<'+newMsg.member.displayName+'>: '+ DQT.Q2D(newMsg.content,client).MsgRepAtUser().subject;
    var delOptions = {
      uri: 'http://127.0.0.1:7501/delete_msg',
      method: 'POST',
      json: deleted
    };

    request(delOptions, function (error1, response1, body1) {
      if (!error1 && response1.statusCode == 200) {
        var sendOptions = {
          uri: 'http://127.0.0.1:7501/send_group_msg',
          method: 'POST',
          json: CQMsg
        };

        request(sendOptions, function (error2, response2, body2) {
          if (!error2 && response2.statusCode == 200) {
            setMsgMap.run({DisMsgID:newMsg.id, QQMsgID:body2.data.message_id.toString(10)});
          }
        });
      }
    });
  };
}
