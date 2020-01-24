exports.run = async (clients, msg) => {
  const fs = require("fs");
  const path = require("path");
  var ToDis = require('./ToDis.js');
  var ToTel = require('./ToTel.js');
  const util = require('./../lib/util.js');
  var QQ = clients.qq;
  let chanMap = clients.cmap;
  //var voice = clients.v;

  /*for (var i = 0; i < chanMap.DIS_GID.length; i++) {
    clients.dis.guilds.get(chanMap.DIS_GID[i]).fetchMembers();
  }*/


  if ((msg.message_type === 'group') && (chanMap.QQ_GPID.includes(msg.group_id.toString(10)))) {
    if (chanMap.DIS_CID[chanMap.QQ_GPID.indexOf(msg.group_id.toString(10))]) {
      var TargetDisChan = clients.dis.channels.get(chanMap.DIS_CID[chanMap.QQ_GPID.indexOf(msg.group_id.toString(10))]);
    } else {var TargetDisChan = null};
    if (chanMap.TEL_CID[chanMap.QQ_GPID.indexOf(msg.group_id.toString(10))]) {
      var TargetTelGP = chanMap.TEL_CID[chanMap.QQ_GPID.indexOf(msg.group_id.toString(10))];
    } else {var TargetTelGP = null};
    var src = { "from":"qq", "id":msg.message_id, "targetChan":TargetDisChan };


    if (msg.post_type === 'message') {
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
            DisMsg.content += new util.ToD(curr.data.text,clients.dis).MsgRepAtUser().subject;
            //TelMsg.text += new util.ToT(curr.data.text,clients.tel).MsgRepAtUser().subject;
            break;
          case 'image':
            DisMsg.content += curr.data.url;
            /*DisMsg.files.push(curr.data.url);*/
            break;
          case 'at': DisMsg.content += '@'+ curr.data.qq + ' '; TelMsg.text += '@'+ curr.data.qq + ' '; break;
          case 'face': DisMsg.content += new util.ToD(curr.data.id,clients.dis).MsgRepEmj(0).subject; TelMsg.text += 'FaceID:' + curr.data.id + ' '; break;
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
          /*case 'record': await voice.decode(`./../CoolQ Air/data/record/${curr.data.file}`, `${curr.data.file.split(".")[0]}.mp3`, {format:"mp3", channels:2}, (file) => {
            DisMsg.files.push({attachment: file, name: `${curr.data.file.split(".")[0]}.mp3`
          });}); break;*/
          default: DisMsg.content += JSON.stringify(curr) + ' '; break;
        }
      }
    }
    else if (msg.post_type === 'notice') {
      var user = QQ('get_group_member_info', {
          group_id: context.group_id,
          user_id: context.user_id
      });
      if (context.operator_id !== undefined && context.operator_id) {
        var operator = QQ('get_group_member_info', {
            group_id: context.group_id,
            user_id: context.operator_id
        })
      } else { var operator = null };
      var DisMsg = { "targetChan":TargetDisChan, "type":"notice", "content": ""};
      var TelMsg = { "chat_id":TargetTelGP, "text":"" };
      Promise.all([user,operator]).then(result => {
        user = result[0]; operator = result[1];
        switch (context.notice_type) {
          case 'group_increase':
            var username = user.nickname || '新人';
            DisMsg.content = TelMsg.text += `< Q - ${username} 已加入群聊。 >`
            break;
          case 'group_decrease':
            if (operator!==null&&operator) {
              var leave =  ` 被 ${operator.nickname} 移除。 >`
            } else { var leave = " 已離開群聊。 >"}
            DisMsg.content = TelMsg.text += "< Q - " + user.nickname + leave;
            break;
          case 'group_admin':
            if (context.sub_type === "set") { context.sub_type = `委任` }
            else if (context.sub_type === "unset") { context.sub_type = `移除` }
            DisMsg.content = TelMsg.text += `< Q - ${user.nickname} 被${context.sub_type}管理。>`
            break;
          case 'group_ban':
            if (context.sub_type==="ban") {
              var time = util.DP(context.duration, "s").chiExp;
              var ban = ` 被 ${operator.nickname} 禁言 ${time}。 >`;
            } else { var ban = " 被解除禁言。 >"}
            DisMsg.content = TelMsg.text += "< Q - " + user.nickname + ban;
            break;
          default: break;

      }}).catch(err => {
          console.log(err);
      });
    } else return;

    if (DisMsg.embed) { DisMsg.type = "embed" } else { DisMsg.type = "normal" }
    if (TargetDisChan) { ToDis.run(clients.dis, DisMsg, src); }
    if (TargetTelGP) { ToTel.run(clients.tel, TelMsg, src); }
  };
}
