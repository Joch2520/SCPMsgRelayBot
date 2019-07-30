exports.run = (client, msg) => {
  const fs = require("fs");
  const path = require("path");
  const request = require('request');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  let pref = JSON.parse(fs.readFileSync(path.join(__dirname,'../../config.json'), 'utf8')).prefix.toLowerCase();

  if (msg.content.toLowerCase().startsWith(pref)) return;
  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM DisToCQ WHERE DisMsgID = ?').get(msg.id);
  //var debug = '' + msg.id + ' / ' + JSON.stringify(QQMsgID);
  //console.log(debug);
  if (QQMsgID.QQMsgID) {
    var deleted = {message_id: parseInt(QQMsgID.QQMsgID)};
    //deleted.message_id = QQMsgID.QQMsgID;
    console.log(JSON.stringify(deleted));
    var options = {
      uri: 'http://127.0.0.1:7501/delete_msg',
      method: 'POST',
      json: deleted
    };

    request(options, function (error, response, body) {
    //request.post({url:"http://127.0.0.1:7501/delete_msg",form:{message_id:parseInt(QQMsgID.QQMsgID)}}, function (error, response, body) {
      //console.log(JSON.stringify(options))
      if (!error && response.statusCode == 200) {
      MsgMap.prepare('DELETE FROM DisToCQ WHERE DisMsgID = ?').run(msg.id);
      }
    });
  }
}
