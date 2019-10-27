exports.run = (clients, DisMsg) => {
  const fs = require("fs");
  const path = require("path");
  var ToQQ = require('./ToQQ.js');
  var ToTel = require('./ToTel.js');
  const util = require('./../lib/util.js');
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/channelMapping.json'), 'utf8'));

  if (chanMap.DisChanID.includes(DisMsg.channel.id)) {
    if (chanMap.QQGPID[chanMap.DisChanID.indexOf(DisMsg.channel.id)]) {
      var TargetQQGP = parseInt(chanMap.QQGPID[chanMap.DisChanID.indexOf(DisMsg.channel.id)]);
    } else {var TargetQQGP = null};
    if (chanMap.TelChatID[chanMap.DisChanID.indexOf(DisMsg.channel.id)]) {
      var TargetTelGP = chanMap.TelChatID[chanMap.DisChanID.indexOf(DisMsg.channel.id)];
    } else {var TargetTelGP = null};


    var QQMsg = { "group_id":TargetQQGP, "message":"" };
    var TelMsg = { "chat_id":TargetTelGP, "text":"" };
    var src = { "from":"dis", "id":DisMsg.id };

    QQMsg.message = TelMsg.text = '<'+DisMsg.member.displayName+' ('+DisMsg.author.tag+')>: ';
    QQMsg.message += util.ToQ(DisMsg.content).MsgRepAtUser().subject;
    TelMsg.text += util.ToT(DisMsg.content).MsgRepAtUser().subject;
    //console.log(JSON.stringify(QQMsg));
    //console.log(JSON.stringify(TelMsg));
    if (TargetQQGP) { ToQQ.run(clients.qq, QQMsg, src); }
    if (TargetTelGP) { ToTel.run(clients.tel, TelMsg, src); }
  }
}
