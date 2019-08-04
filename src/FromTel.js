exports.run = (TelMsg) => {
  const fs = require("fs");
  const path = require("path");
  var ToQQ = require('./ToQQ.js');
  var ToDis = require('./ToDis.js');
  const Transcoder = require('./../lib/Transcoder.js');
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  if (chanMap.TelChatID.includes(TelMsg.chat.id.toString(10))) {
    if (chanMap.QQGPID[chanMap.TelChatID.indexOf(TelMsg.chat.id.toString(10))]) {
      var TargetQQGP = parseInt(chanMap.QQGPID[chanMap.TelChatID.indexOf(TelMsg.chat.id.toString(10))]);
    } else {var TargetQQGP = null};
    if (chanMap.DisChanID[chanMap.TelChatID.indexOf(TelMsg.chat.id.toString(10))]) {
      var TargetDisChan = chanMap.DisChanID[chanMap.TelChatID.indexOf(TelMsg.chat.id.toString(10))];
    } else {var TargetDisChan = null};

    var transName = '<'+TelMsg.from.first_name;
    if (TelMsg.from.last_name) { transName += ' ' + TelMsg.from.last_name; };
    if (TelMsg.from.username) { transName += ' ('+TelMsg.from.username+')'};
    transName += '>';
    var QQMsg = { "group_id":TargetQQGP, "message":"" };
    var DisMsg = { "targetChan":TargetDisChan, "type":"", "sender":transName, "content":"", "embed":{} };
    var src = { "from":"tel", "id":TelMsg.id };
    QQMsg.message = transName + ': '
    QQMsg.message += Transcoder.D2Q(DisMsg.content).MsgRepAtUser().subject;
    //TelMsg.text += Transcoder.D2T(DisMsg.content).MsgRepAtUser().subject;
    //console.log(JSON.stringify(QQMsg));
    //console.log(JSON.stringify(TelMsg));
    if (TargetQQGP) { ToQQ.run(QQMsg, src); }
    if (TargetDisChan) { ToDis.run(DisMsg, src); }
  }
}
