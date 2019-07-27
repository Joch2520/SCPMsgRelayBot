exports.run = (DisMsg) => {
  const fs = require("fs");
  const path = require("path");
  const request = require('request');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let setMsgMap = MsgMap.prepare("INSERT OR REPLACE INTO DisToCQ (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");

  if (chanMap.DisChanID.includes(DisMsg.channel.id)) {
    var CQMsg = { "group_id":"", "message":"" }
    CQMsg.group_id = chanMap.QQGPID[chanMap.DisChanID.indexOf(DisMsg.channel.id)].toString(10);
    CQMsg.message = '<'+DisMsg.member.displayName+'>: '+DisMsg.content;
    var options = {
      uri: 'http://127.0.0.1:7501/send_group_msg',
      method: 'POST',
      json: CQMsg
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        setMsgMap.run({DisMsgID:DisMsg.id, QQMsgID:body.message_id});
      }
    });
  }
}
