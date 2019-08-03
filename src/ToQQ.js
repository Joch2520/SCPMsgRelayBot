exports.run = (receive, src) => {
  const path = require("path");
  const request = require('request');
  const SQLite = require('better-sqlite3');
  const Transcoder = require('./../lib/Transcoder.js');
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let DToQMap = MsgMap.prepare("INSERT OR REPLACE INTO FromDis (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");
  let TToQMap = MsgMap.prepare("INSERT OR REPLACE INTO FromTel (TelMsgID, QQMsgID) VALUES (@TelMsgID, @QQMsgID);");

  if (receive.from.toLowerCase === "dis") {
    var optionsQ = {
      uri: 'http://127.0.0.1:7501/send_group_msg',
      method: 'POST',
      json: QQMsg
    };

    request(optionsQ, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        /*var debug = JSON.stringify({DisMsgID:receive.orig.id, QQMsgID:body.data.message_id})
        console.log(JSON.stringify(response));
        console.log(JSON.stringify(body));
        console.log(debug);*/
        if (src.from === "dis") {
          DToQMap.run({DisMsgID:src.id, QQMsgID:body.data.message_id.toString(10)});
        } else if (src.from === "tel") {
          TToQMap.run({TelMsgID:src.id, QQMsgID:body.data.message_id.toString(10)});
        }
      }
    });
  };
}
