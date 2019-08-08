exports.run = (disClient, telClient, newMsg) => {
  const fs = require("fs");
  const path = require("path");
  const SQLite = require('better-sqlite3');
  var Transcoder = require(path.join(__dirname,'../../lib/Transcoder.js'));
  var UpdateQQ = require(path.join(__dirname,'../../src/UpdateQQ.js'));
  var UpdateDis = require(path.join(__dirname,'../../src/UpdateDis.js'));
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/channelMapping.json'), 'utf8'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");


  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM FromTel WHERE TelMsgID = ?').get(newMsg.id);
  let DisMsgID = MsgMap.prepare('SELECT DisMsgID FROM FromTel WHERE TelMsgID = ?').get(newMsg.id);

  var transName = '<'+newMsg.from.first_name;
  if (newMsg.from.last_name) { transName += ' ' + newMsg.from.last_name; };
  if (newMsg.from.username) { transName += ' ('+newMsg.from.username+')'};
  transName += '>';

  if (newMsg.forward_from) {
    transName += '[轉寄] ' +'<<'+newMsg.forward_from.first_name;
    if (newMsg.forward_from.last_name) { transName += ' ' + newMsg.forward_from.last_name; };
    if (newMsg.forward_from.username) { transName += ' ('+newMsg.forward_from.username+')'};
    transName += '>>';
  } else if (newMsg.forward_sender_name) {
    transName += '[轉寄] ' +'<<'+newMsg.forward_sender_name+'>>';
  }

  if (QQMsgID) {
    var deleted = {"message_id":QQMsgID.QQMsgID.toString(10)};
    var QQMsg = { "group_id":"", "message":"" }
    QQMsg.group_id = parseInt(chanMap.QQGPID[chanMap.TelChatID.indexOf(newMsg.chat.id.toString(10))]);
    QQMsg.message = transName +': '+ Transcoder.ToQ(newMsg.content).MsgRepAtUser().subject;
    var src = { "from":"tel", "id":newMsg.message_id };
    UpdateQQ.run(deleted, QQMsg, src);
  };
  if (DisMsgID) {
    var DisMsg = {
      "targetChan": chanMap.DisChanID[chanMap.TelChatID.indexOf(newMsg.chat.id.toString(10))],
      "type": "",
      "sender": transName,
      "content": newMsg.text,
      "embed": {}
    };
    var src = { "from":"tel", "id":newMsg.message_id };
    UpdateDis.run(disClient, DisMsg, src);
  };
}
