exports.run = (disClient, telClient, oldMsg, newMsg) => {
  const fs = require("fs");
  const path = require("path");
  const SQLite = require('better-sqlite3');
  var Transcoder = require(path.join(__dirname,'../../lib/Transcoder.js'));
  var UpdateQQ = require(path.join(__dirname,'../../src/UpdateQQ.js'));
  var UpdateTel = require(path.join(__dirname,'../../src/UpdateTel.js'));
  const MsgMap = new SQLite(path.join(__dirname,'../../../data/MsgMappings.sqlite'));
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../data/channelMapping.json'), 'utf8'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");


  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM FromDis WHERE DisMsgID = ?').get(oldMsg.id);
  let TelMsgID = MsgMap.prepare('SELECT TelMsgID FROM FromDis WHERE DisMsgID = ?').get(oldMsg.id);

  if (QQMsgID) {
    var deleted = {"message_id":QQMsgID.QQMsgID.toString(10)};
    var QQMsg = { "group_id":"", "message":"" }
    QQMsg.group_id = chanMap.QQGPID[chanMap.DisChanID.indexOf(oldMsg.channel.id)];
    QQMsg.message = '<'+newMsg.member.displayName+'>: '+ Transcoder.ToQ(newMsg.content).MsgRepAtUser().subject;
    var src = { "from":"dis", "id":newMsg.id };
    UpdateQQ.run(deleted, QQMsg, src);
  };
  if (TelMsgID) {
    var TelMsg = {
      "chat_id":chanMap.TelChatID[chanMap.DisChanID.indexOf(oldMsg.channel.id)],
      "message_id":TelMsgID.TelMsgID.toString(10),
      "text": '<'+newMsg.member.displayName+'>: '+ Transcoder.ToT(newMsg.content,telClient).MsgRepAtUser().subject
    };
    var src = { "from":"dis", "id":newMsg.id };
    UpdateTel.run(telClient, TelMsg, src);
  };
}
