var {DP} = require('./../../lib/util.js')

module.exports.run = (clients, msg, args) => {
  var t = args.shift();
  let ReturnEmbed = {
    color: 0x660000,
    title: "用法：",
    description: clients.config.CMD_PREFIX+"timer <XX:XX:XX.XXX/XhXmXs> [<自訂提醒訊息>]",
    timestamp: new Date()
  }
  try {
    if (t.includes(":")) {
      var time = new DP(t, ":");
    } else if (t.includes("h")||t.includes("m")||t.includes("s")) {
      var time = new DP(t, "initial");
    } else {
      console.log("gay")
      return msg.channel.send({embed:ReturnEmbed})
    }
  } catch (e) {
    if (e.code = `INVALID_TIME_REP`) {
      console.log("gay2")
      return msg.channel.send({embed:ReturnEmbed})
    } else throw e;
  }
  t = time.toMS();
  if (!args[0]||args[0]==undefined) {
    var timeoutmsg = `<@${msg.author.id}> 提醒: ${time.chiExp}已到達。`;
  } else {
    var timeoutmsg = `<@${msg.author.id}> 提醒: ${args.join(' ')}`;
  }
  msg.channel.send(`<@${msg.author.id}>，${time.chiExp}計時器已設置。`);
  setTimeout(()=>{
    msg.channel.send(timeoutmsg);
  }, t)
}

module.exports.help = {
  name: "timer",
  embed: {
    description: "設定倒數計時器，並在到達時發送提醒訊息。\n用法: timer <XX:XX:XX.XXX/XhXmXs> [<自訂提醒訊息>]",
    fields: [
      {
        name: `範例1: timer 2m576s`,
        value: `設定11分36秒計時器，當時間到達時會發出 "[@用戶] 提醒: 11分36秒已到達" 訊息。`
      },
      {
        name: `範例2: timer 20:75 範例`,
        value: `設定21分15秒計時器，當時間到達時會發出 "[@用戶] 提醒: 範例" 訊息。`
      },
      {
        name: `範例2: timer 20:882`,
        value: `時間表達錯誤，無法設定計時器。`
      }
    ]
  }
}
