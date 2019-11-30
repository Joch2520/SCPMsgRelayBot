exports.run = (clients, newMsg) => {
  const fs = require("fs");
  const path = require("path");
  const SQLite = require('better-sqlite3');
  var util = require(path.join(__dirname,'../../lib/util.js'));
  var UpdateQQ = require(path.join(__dirname,'../../MsgHandler/UpdateQQ.js'));
  var UpdateDis = require(path.join(__dirname,'../../MsgHandler/UpdateDis.js'));
  const MsgMap = new SQLite(path.join(__dirname,'../../../data/MsgMappings.sqlite'));
  let chanMap = clients.cmap;

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");


  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM FromTel WHERE TelMsgID = ?').get(newMsg.message_id);
  let DisMsgID = MsgMap.prepare('SELECT DisMsgID FROM FromTel WHERE TelMsgID = ?').get(newMsg.message_id);

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
    QQMsg.group_id = parseInt(chanMap.QQ_GPID[chanMap.TEL_CID.indexOf(newMsg.chat.id.toString(10))]);
    QQMsg.message = transName +': '+ util.ToQ(newMsg.content).MsgRepAtUser().subject;
    var MsgHandler = { "from":"tel", "id":newMsg.message_id };
    UpdateQQ.run(clients.qq, deleted, QQMsg, MsgHandler);
  };
  if (DisMsgID) {
    var DisMsg = {
      "msg_id": DisMsgID.DisMsgID,
      "targetChan": chanMap.DIS_CID[chanMap.TEL_CID.indexOf(newMsg.chat.id.toString(10))],
      "type": "",
      "sender": transName,
      "content": newMsg.text,
      "embed": {}
    };
    var MsgHandler = { "from":"tel", "id":newMsg.message_id };
    UpdateDis.run(clients.dis, DisMsg, MsgHandler);
  };
}
