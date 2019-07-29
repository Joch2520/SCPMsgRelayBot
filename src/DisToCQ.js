exports.run = (DisMsg) => {
  const fs = require("fs");
  const path = require("path");
  const request = require('request');
  const SQLite = require('better-sqlite3');
  const DQT = require(path.join(__dirname,'../lib/DQTranscoder.js'));
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let setMsgMap = MsgMap.prepare("INSERT OR REPLACE INTO DisToCQ (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");

  if (chanMap.DisChanID.includes(DisMsg.channel.id)) {
    var CQMsg = { "group_id":parseInt(chanMap.QQGPID[chanMap.DisChanID.indexOf(DisMsg.channel.id)]), "message":"" }
    CQMsg.message = '<'+DisMsg.member.displayName+'('+DisMsg.author.tag+')>: ';
    CQMsg.message += DQT.D2Q(DisMsg.content).MsgRepAtUser().subject;

    //console.log(JSON.stringify(CQMsg));
    var options = {
      uri: 'http://127.0.0.1:7501/send_group_msg',
      method: 'POST',
      json: CQMsg
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        /*var debug = JSON.stringify({DisMsgID:DisMsg.id, QQMsgID:body.data.message_id})
        console.log(JSON.stringify(response));
        console.log(JSON.stringify(body));
        console.log(debug);*/
        setMsgMap.run({DisMsgID:DisMsg.id, QQMsgID:body.data.message_id.toString(10)});
      }
    });
  }
}
