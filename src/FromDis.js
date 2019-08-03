exports.run = (DisMsg) => {
  const fs = require("fs");
  const path = require("path");
  const request = require('request');
  const https = require('https');
  var ToQQ = require('./ToQQ.js');
  var ToTel = require('./ToTel.js');
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  if (chanMap.DisChanID.includes(DisMsg.channel.id)) {
    var TargetQQGP = parseInt(chanMap.QQGPID[chanMap.DisChanID.indexOf(DisMsg.channel.id)]);
    var TargetTelGP = chanMap.TelGPID[chanMap.DisChanID.indexOf(DisMsg.channel.id)];
    var QQMsg = { "group_id":TargetQQGP, "message":"" };
    var TelMsg = { "chat_id":TargetTelGP, "text":"" };
    var src = { "from":"dis", "id":DisMsg.id };
    QQMsg.message = TelMsg.text = '<'+DisMsg.member.displayName+'('+DisMsg.author.tag+')>: ';
    QQMsg.message += Transcoder.D2Q(DisMsg.content).MsgRepAtUser().subject;
    TelMsg.text += Transcoder.D2T(DisMsg.content).MsgRepAtUser().subject;
    //console.log(JSON.stringify(QQMsg));
    //console.log(JSON.stringify(TelMsg));
    if (TargetQQGP) { ToQQ.run(QQMsg, src); }
    if (TargetTelGP) { ToTel.run(TelMsg, src); }
  }
}
