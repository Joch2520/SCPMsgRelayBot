exports.run = (clients, TelMsg) => {
  const fs = require("fs");
  const path = require("path");
  var ToQQ = require('./ToQQ.js');
  var ToDis = require('./ToDis.js');
  const util = require('./../lib/util.js');
  let chanMap = clients.cmap;

  if (chanMap.TEL_CID.includes(TelMsg.chat.id.toString(10))) {
    if (chanMap.QQ_GPID[chanMap.TEL_CID.indexOf(TelMsg.chat.id.toString(10))]) {
      var TargetQQGP = parseInt(chanMap.QQ_GPID[chanMap.TEL_CID.indexOf(TelMsg.chat.id.toString(10))]);
    } else {var TargetQQGP = null};
    if (chanMap.DIS_CID[chanMap.TEL_CID.indexOf(TelMsg.chat.id.toString(10))]) {
      var TargetDisChan = chanMap.DIS_CID[chanMap.TEL_CID.indexOf(TelMsg.chat.id.toString(10))];
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
    var DisMsg = { "targetChan":TargetDisChan, "type":"", "sender":transName, "content":"", "embed":{}, "file":[] };
    var src = { "from":"tel", "id":TelMsg.id };
    QQMsg.message = transName + ': '
    QQMsg.message += new util.ToQ(DisMsg.content).MsgRepAtUser().subject;
    //TelMsg.text += new util.ToD(DisMsg.content).MsgRepAtUser().subject;
    //console.log(JSON.stringify(QQMsg));
    //console.log(JSON.stringify(TelMsg));
    if (TargetQQGP) { ToQQ.run(clients.qq, QQMsg, src); }
    if (TargetDisChan) { ToDis.run(clients.dis, DisMsg, src); }
  }
}
