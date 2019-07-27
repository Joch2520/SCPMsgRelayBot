exports.run = (client, msg) => {
  const fs = require("fs");
  const path = require("path");
  const request = require('request');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  let pref = JSON.parse(fs.readFileSync(path.join(__dirname,'../../config.json'), 'utf8')).prefix.toLowerCase();

  if (msg.content.toLowerCase().startsWith(pref)) return;
  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM DisToCQ WHERE DisMsgID = ?').get(msg.id);
  if (QQMsgID) {
    var deleted = {"message_id":""};
    deleted.message_id = QQMsgID;
    var options = {
      uri: 'http://127.0.0.1:7501/delete_msg',
      method: 'POST',
      json: deleted
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      MsgMap.prepare('DELETE FROM DisToCQ WHERE DisMsgID = ?').get(msg.id);
      }
    });
  }
}
