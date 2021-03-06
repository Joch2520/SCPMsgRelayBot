exports.run = async (clients, msg) => {
  var ToDis = require('./ToDis.js');
  var ToTel = require('./ToTel.js');
  const util = require('./../lib/util.js');
  var QQ = clients.qq;
  let chanMap = clients.cmap;
  //var voice = clients.v;

  /*for (var i = 0; i < chanMap.DIS_GID.length; i++) {
    clients.dis.guilds.get(chanMap.DIS_GID[i]).fetchMembers();
  }*/

  var TargetDisChan = null, TargetTelGP = null, DisMsg = {"type":""};
  if (chanMap.QQ_GPID.includes(msg.group_id.toString(10))) {
    if (chanMap.DIS_CID[chanMap.QQ_GPID.indexOf(msg.group_id.toString(10))]) {
		  var TargetDisChan = clients.dis.channels.get(chanMap.DIS_CID[chanMap.QQ_GPID.indexOf(msg.group_id.toString(10))]);
		}
		if (chanMap.TEL_CID[chanMap.QQ_GPID.indexOf(msg.group_id.toString(10))]) {
		  var TargetTelGP = chanMap.TEL_CID[chanMap.QQ_GPID.indexOf(msg.group_id.toString(10))];
		}
		var src = { "from":"qq", "id":msg.message_id, "targetChan":TargetDisChan };
  	if (msg.message_type == 'group') {

  		if (msg.post_type == 'message' && msg.sub_type == 'normal') {
  		  var transName = '[';
  		  if (msg.sender.title) { transName += '<'+msg.sender.title+'>'}
  		  if (msg.sender.card) { transName += msg.sender.card }
  			else if (msg.sender.nickname) { transName += msg.sender.nickname }
  		  transName += ' (' + msg.sender.user_id + ')';
  		  transName += ']';
  		  var DisMsg = { "targetChan":TargetDisChan, "type":"", "sender":transName, "content":"", "embed":null, "files":[] };
  		  var TelMsg = { "chat_id":TargetTelGP, "text":"" };
  		  for (var i = 0; i < msg.message.length; i++) {
  			var curr = msg.message[i];
  			switch (curr.type) {
  			  case 'text':
          if (curr.data.text.includes(clients.config.NO_RELAY)) return;
  				DisMsg.content += new util.ToD(curr.data.text,clients.dis).MsgRepAtUser().subject;
  				//TelMsg.text += new util.ToT(curr.data.text,clients.tel).MsgRepAtUser().subject;
  				break;
  			  case 'image':
  				DisMsg.content += ` ${curr.data.url} `;
  				/*DisMsg.files.push(curr.data.url);*/
  				break;
  			  case 'at': DisMsg.content += '@'+ curr.data.qq + ' '; TelMsg.text += '@'+ curr.data.qq + ' '; break;
  			  case 'face': DisMsg.content += new util.ToD(curr.data.id,clients.dis).MsgRepEmj(0).subject; TelMsg.text += 'FaceID:' + curr.data.id + ' '; break;
  			  case 'emoji': DisMsg.content += 'EmojiID:' + curr.data.id + ' '; TelMsg.text += 'EmojiID:' + curr.data.id + ' '; break;
  			  case 'music': switch (curr.data.type) {
    				case 'qq': DisMsg.embed = {
      				  color: 0xFF9900,
      				  title: curr.data.title,
      				  url: 'http://y.qq.com'+ curr.data.id,
      				  description: curr.data.content,
      				  thumbnail: { url: curr.data.image }
      				}; break;
    				case '163': DisMsg.embed = {
      				  color: 0xFF9900,
      				  title: curr.data.title,
      				  url: 'http://music.163.com/#/song?id='+ curr.data.id,
      				  description: curr.data.content,
      				  thumbnail: { url: curr.data.image }
      				}; break;
    				/*case 'xiami':    ; break;*/
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
  			  case 'rich':
            if (curr.data.content&&curr.data.content!=undefined) {
              var det = JSON.parse(curr.data.content)
              if (det.detail_1&&det.detail_1!=undefined) {
                DisMsg.embed = {
                  color: 0x99FF00,
        				  author: {
                    name: det.detail_1.title,
                    icon: `https://${det.detail_1.icon}`
                  },
                  title: det.detail_1.desc,
          				thumbnail: { url: `https://${det.detail_1.preview}` },
                  footer: { text: curr.data.title },
                  url: `https://${det.detail_1.url}`
                }
              } else if (det.music&&det.music!=undefined) {
                DisMsg.embed = {
        				  color: 0xFF9900,
                  author: {
                    name: det.music.desc,
                    icon: det.music.source_icon
                  },
                  title: det.music.title,
          				thumbnail: { url: det.music.preview },
                  footer: { text: det.music.tag },
                  url: det.music.musicUrl
        				}
              } else if (det.news&&det.news!=undefined) {
                DisMsg.embed = {
        				  color: 0xFF9900,
                  author: {
                    name: det.news.tag
                  },
                  title: det.news.title,
                  description: det.news.desc,
          				thumbnail: { url: det.news.preview },
                  footer: { text: curr.data.title },
                  url: det.news.jumpUrl
        				}
              } else console.log(curr.data)
            } else if (curr.data.title!=undefined) {
              DisMsg.embed = {
                footer: { text: curr.data.title },
                description: curr.data.content
              }
            } else if (curr.data.text!=undefined) {
              var context = curr.data.text.split(" ")
              DisMsg.embed = {
                title: context.shift(),
                footer: { text: context.pop() },
                description: context.join(" ")
              }
            }; break;
  			  /*case 'record': await voice.decode(`./../CoolQ Air/data/record/${curr.data.file}`, `${curr.data.file.split(".")[0]}.mp3`, {format:"mp3", channels:2}, (file) => {
  				DisMsg.files.push({attachment: file, name: `${curr.data.file.split(".")[0]}.mp3`
  			  });}); break;*/
  			  default: DisMsg.content += JSON.stringify(curr) + ' '; break;
  			}
  		  }
  		}
  	} else if (msg.post_type == 'notice') {
  	  var user = await QQ('get_group_member_info', {
  		  group_id: msg.group_id,
  		  user_id: msg.user_id
  	  });
  	  if (msg.operator_id != undefined && msg.operator_id!=msg.user_id) {
    		var operator = await QQ('get_group_member_info', {
    			group_id: msg.group_id,
    			user_id: msg.operator_id
    		})
  	  } else { var operator = null };
  	  var DisMsg = { "targetChan":TargetDisChan, "type":"notice", "content": ""};
  	  var TelMsg = { "chat_id":TargetTelGP, "text":"" };
  	  switch (msg.notice_type) {
  		  case 'group_increase':
    			var username = user.nickname || '新人';
    			DisMsg.content = `< QQ: ${username} (${user.user_id}) 已加入群聊 >`
    			break;
  		  case 'group_decrease':
    			if (msg.sub_type=="kick") { var leave =  ` 被 ${operator.nickname} (${operator.user_id})移除 >` }
          else if (msg.sub_type=="kick_me") { var leave = ` 被 ${operator.nickname} (${operator.user_id})移除，中繼器無法正常服務。 >` }
          else { console.log(msg); var leave = " 已離開群聊 >" }
    			DisMsg.content = `< QQ: ${user.nickname} (${user.user_id})${leave}`;
    			break;
  		  case 'group_admin':
    			if (msg.sub_type=="set") { msg.sub_type = `委任` }
    			else if (msg.sub_type=="unset") { msg.sub_type = `移除` }
    			DisMsg.content = `< QQ: ${user.nickname} (${user.user_id}) 被${msg.sub_type}管理 >`
    			break;
  		  case 'group_ban':
    			if (msg.sub_type=="ban") {
    			  var time = new util.DP(msg.duration, "s").chiExp;
    			  var ban = ` 被 ${operator.nickname} (${operator.user_id}) 禁言${time} >`;
    			} else { var ban = " 被解除禁言 >"}
    			DisMsg.content = `< QQ: ${user.nickname} (${user.user_id})${ban}`;
    			break;
  		  default: break;
  	  }
  	} else return;

    if (!DisMsg.type) { if (DisMsg.embed) { DisMsg.type = "embed" } else { DisMsg.type = "normal" } }
    if (TargetDisChan) { ToDis.run(clients.dis, DisMsg, src); }
    if (TargetTelGP) { ToTel.run(clients.tel, TelMsg, src); }
  };
}
