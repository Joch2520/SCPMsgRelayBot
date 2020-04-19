exports.run = (clients, DisMsg) => {
  var ToQQ = require('./ToQQ.js');
  var ToTel = require('./ToTel.js');
  const util = require('./../lib/util.js');
  let chanMap = clients.cmap;

  if (chanMap.DIS_CID.includes(DisMsg.channel.id)) {
    if (chanMap.QQ_GPID[chanMap.DIS_CID.indexOf(DisMsg.channel.id)]) {
      var TargetQQGP = parseInt(chanMap.QQ_GPID[chanMap.DIS_CID.indexOf(DisMsg.channel.id)]);
    } else {var TargetQQGP = null};
    if (chanMap.TEL_CID[chanMap.DIS_CID.indexOf(DisMsg.channel.id)]) {
      var TargetTelGP = chanMap.TEL_CID[chanMap.DIS_CID.indexOf(DisMsg.channel.id)];
    } else {var TargetTelGP = null};


    var QQMsg = { "group_id":TargetQQGP, "message":"" };
    var TelMsg = { "chat_id":TargetTelGP, "text":"" };
    var src = { "from":"dis", "id":DisMsg.id };

    QQMsg.message = TelMsg.text = '['+DisMsg.member.displayName+' ('+DisMsg.author.tag+')]: ';
    QQMsg.message += new util.ToQ(DisMsg).ReplaceAll().subject;
    TelMsg.text += new util.ToT(DisMsg.content).ReplaceAll().subject;
    //console.log(JSON.stringify(QQMsg));
    //console.log(JSON.stringify(TelMsg));
    if (TargetQQGP) { ToQQ.run(clients.qq, QQMsg, src); }
    if (TargetTelGP) { ToTel.run(clients.tel, TelMsg, src); }
  }
}
