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

    if (TelMsg.forward_from) {
      transName += '[轉寄] ' +'<<'+TelMsg.forward_from.first_name;
      if (TelMsg.forward_from.last_name) { transName += ' ' + TelMsg.forward_from.last_name; };
      if (TelMsg.forward_from.username) { transName += ' ('+TelMsg.forward_from.username+')'};
      transName += '>>';
    } else if (TelMsg.forward_sender_name) {
      transName += '[轉寄] ' +'<<'+TelMsg.forward_sender_name+'>>';
    }

    var QQMsg = { "group_id":TargetQQGP, "message":"" };
    var DisMsg = { "targetChan":TargetDisChan, "type":"", "sender":transName, "content":"", "embed":{} };
    var src = { "from":"tel", "id":TelMsg.id };
    QQMsg.message = transName + ': '
    QQMsg.message += Transcoder.ToQ(DisMsg.content).MsgRepAtUser().subject;
    //TelMsg.text += Transcoder.ToD(DisMsg.content).MsgRepAtUser().subject;
    //console.log(JSON.stringify(QQMsg));
    //console.log(JSON.stringify(TelMsg));
    if (TargetQQGP) { ToQQ.run(QQMsg, src); }
    if (TargetDisChan) { ToDis.run(DisMsg, src); }
  }
}
