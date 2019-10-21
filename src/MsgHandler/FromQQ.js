exports.run = (clients, msg) => {
  const fs = require("fs");
  const path = require("path");
  var ToDis = require('./ToDis.js');
  var ToTel = require('./ToTel.js');
  const Transcoder = require('./../lib/Transcoder.js');
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/channelMapping.json'), 'utf8'));

  /*for (var i = 0; i < chanMap.DisGuildID.length; i++) {
    clients.dis.guilds.get(chanMap.DisGuildID[i]).fetchMembers();
  }*/


  if ((msg.message_type === 'group') && (chanMap.QQGPID.includes(msg.group_id.toString(10))) && (msg.post_type === 'message')) {
    if (chanMap.DisChanID[chanMap.QQGPID.indexOf(msg.group_id.toString(10))]) {
      var TargetDisChan = clients.dis.channels.get(chanMap.DisChanID[chanMap.QQGPID.indexOf(msg.group_id.toString(10))]);
    } else {var TargetDisChan = null};
    if (chanMap.TelChatID[chanMap.QQGPID.indexOf(msg.group_id.toString(10))]) {
      var TargetTelGP = chanMap.TelChatID[chanMap.QQGPID.indexOf(msg.group_id.toString(10))];
    } else {var TargetTelGP = null};
    var src = { "from":"dis", "id":msg.message_id, "targetChan":TargetDisChan };
    var transName = '<';
    if (msg.sender.title) { transName += '['+msg.sender.title+']'}
    if (msg.sender.card) { transName += msg.sender.card }
      else if (msg.sender.nickname) { transName += msg.sender.nickname }
    transName += ' (' + msg.sender.user_id + ')';
    transName += '>';
    var DisMsg = { "targetChan":TargetDisChan, "type":"", "sender":transName, "content":"", "embed":null, "files":[] };
    var TelMsg = { "chat_id":TargetTelGP, "text":"" };
    for (var i = 0; i < msg.message.length; i++) {
      var curr = msg.message[i];
      switch (curr.type) {
        case 'text':
          DisMsg.content += Transcoder.ToD(curr.data.text,clients.dis).MsgRepAtUser().subject;
          //TelMsg.text += Transcoder.ToT(curr.data.text,clients.tel).MsgRepAtUser().subject;
          break;
        case 'image': DisMsg.files.push(curr.data.url); break;
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
    if (TargetDisChan) { ToDis.run(clients.dis, DisMsg, src); }
    if (TargetTelGP) { ToTel.run(clients.tel, TelMsg, src); }
  };
}
