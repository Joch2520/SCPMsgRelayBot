exports.run = (client, oldMsg, newMsg) => {
  const fs = require("fs");
  const path = require("path");
  const request = require('request');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/channelMapping.json'), 'utf8'));

  MsgMap.prepare("CREATE TABLE IF NOT EXISTS DisToCQ (DisMsgID TEXT PRIMARY KEY, QQMsgID TEXT);").run();
  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let setMsgMap = MsgMap.prepare("INSERT OR REPLACE INTO DisToCQ (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");

  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM DisToCQ WHERE DisMsgID = ?').get(oldMsg.id);
  if (QQMsgID) {
    var deleted = {"message_id":""};
    deleted.message_id = QQMsgID;
    var CQMsg = { "group_id":"", "message":"" }
    CQMsg.group_id = chanMap.QQGPID[i];
    CQMsg.message = '<'+newMsg.member.displayName+'>: '+newMsg.content;
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
            setMsgMap.run({DisMsgID:newMsg.id, QQMsgID:body2.message_id});
          }
        });
      }
    });
  };
}
