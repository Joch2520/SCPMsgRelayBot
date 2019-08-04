exports.run = (oldel, newup, src) => {

  const request = require('request');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  let DToQMap = MsgMap.prepare("INSERT OR REPLACE INTO FromDis (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");
  let TToQMap = MsgMap.prepare("INSERT OR REPLACE INTO FromTel (TelMsgID, QQMsgID) VALUES (@TelMsgID, @QQMsgID);");

  var delOptions = {
    uri: 'http://127.0.0.1:7501/delete_msg',
    method: 'POST',
    json: oldel
  };

  request(delOptions, function (error1, response1, body1) {
    if (!error1 && response1.statusCode == 200) {
      var sendOptions = {
        uri: 'http://127.0.0.1:7501/send_group_msg',
        method: 'POST',
        json: newup
      };

      request(sendOptions, function (error2, response2, body2) {
        if (!error2 && response2.statusCode == 200) {
          if (src.from.toLowerCase === "dis") {
            DToQMap.run({DisMsgID:src.id, QQMsgID:body2.data.message_id.toString(10)});
          } else if (src.from.toLowerCase === "tel") {
            TToQMap.run({TelMsgID:src.id.toString(10), QQMsgID:body2.data.message_id.toString(10)});
          }

        }
      });
    }
  });

}
