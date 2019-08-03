exports.run = (client) => {
  const fs = require("fs");
  const path = require("path");
  const express = require('express');
  const Discord = require('discord.js');
  var ToDis = require('./ToDis.js');
  var ToTel = require('./ToTel.js');
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  const app = express();

  app.use(express.urlencoded({extended:false}));
  app.use(express.json());

  app.listen(7500);
  console.log('Listening from CoolQ at localhost:7500');

  /*for (var i = 0; i < chanMap.DisGuildID.length; i++) {
    client.guilds.get(chanMap.DisGuildID[i]).fetchMembers();
  }*/

  app.post('/', (req, res) => {
    if ((req.body.message_type === 'group') && (chanMap.QQGPID.includes(req.body.group_id.toString(10))) && (req.body.post_type === 'message')) {
      if (chanMap.DisChanID[chanMap.QQGPID.indexOf(req.body.group_id.toString(10))]) {
        var TargetDisChan = client.channels.get(chanMap.DisChanID[chanMap.QQGPID.indexOf(req.body.group_id.toString(10))]);
      } else {var TargetDisChan = null};
      if (chanMap.TelGPID[chanMap.QQGPID.indexOf(req.body.group_id.toString(10))]) {
        var TargetTelGP = chanMap.TelGPID[chanMap.QQGPID.indexOf(req.body.group_id.toString(10))];
      } else {var TargetTelGP = null};
      var src = { "from":"dis", "id":req.body.message_id, "targetChan":TargetDisChan };
      var transName = '<';
      if (req.body.sender.title) { transName += '['+req.body.sender.title+']'}
      if (req.body.sender.card) { transName += req.body.sender.card }
        else if (req.body.sender.nickname) { transName += req.body.sender.nickname }
      transName += ' (' + req.body.sender.user_id + ')';
      transName += '>';
      var DisMsg = { "targetChan":TargetDisChan, "type":"", "sender":transName, "content":"", "embed":{} }, TelMsg = { "chat_id":TargetTelGP, "text":"" };
      var files = [];
      for (var i = 0; i < req.body.message.length; i++) {
        var curr = req.body.message[i];
        switch (curr.type) {
          case 'text':
            DisMsg.content += Transcoder.Q2D(curr.data.text,client).MsgRepAtUser().subject;
            TelMsg.text += Transcoder.Q2D(curr.data.text,client).MsgRepAtUser().subject;
            break;
          case 'image': DisMsg.content += curr.data.url + ' '; break;
          case 'at': DisMsg.content += '@'+ curr.data.qq + ' '; TelMsg.text += '@'+ curr.data.qq + ' '; break;
          case 'face': DisMsg.content += 'FaceID:' + curr.data.id + ' '; TelMsg.text += 'FaceID:' + curr.data.id + ' '; break;
          case 'emoji': DisMsg.content += 'EmojiID:' + curr.data.id + ' '; TelMsg.text += 'EmojiID:' + curr.data.id + ' '; break;
          case 'music': switch (curr.data.type) {
            /*case 'qq': DisMsg.embed = {
              color: 0xFF9900,
              title: curr.data.title,
              url: 'http://y.qq.com'+ curr.data.id,
              description: curr.data.content,
              thumbnail: { url: curr.data.image }
            }; break;
            case '163':    ; break;
            case 'xiami':    ; break;*/
            case 'custom': DisMsg.embed = {
              color: 0xFF9900,
              title: curr.data.title,
              url: curr.data.url,
              description: curr.data.content,
              thumbnail: { url: curr.data.image },
              fields: [{ name: "Song", value: curr.data.audio }]
            }; break;
            default: DisMsg.content += JSON.stringify(curr) + ' '; break;
          }; break;
          case 'share': DisMsg.embed = {
            color: 0x0099FF,
            title: curr.data.title,
            url: curr.data.url,
            description: curr.data.content,
            thumbnail: { url: curr.data.image }
          }; break;
          case 'rich': DisMsg.embed = curr.data; break;
          default: DisMsg.content += JSON.stringify(curr) + ' '; break;
        }
      }
      if (DisMsg.embed) { DisMsg.type = "embed" } else { DisMsg.type = "normal" }
      if (TargetDisChan) { ToDis.run(client, DisMsg, src); }
      if (TargetTelGP) { ToTel.run(TelMsg, src); }
    };
    res.end();
  })
}
