const fs = require("fs");
const config = require('./lib/CnfgLoader');
let chanMap = require('./lib/ChanMapLoader');

const Scpper = require('scpper.js');
const scpClient = new Scpper.Scpper({site: config.SCP_SITE});

const Discord = require('discord.js');
var disClient = new Discord.Client({ autoReconnect: true });
disClient.login(config.DIS_TOKEN);

const Telegram = require("node-telegram-bot-api");
var telClient = new Telegram(config.TEL_TOKEN, {polling: true});

const CQHTTP = require('cqhttp')
//const CQWS = require('cq-websocket');
var cqClient = new CQHTTP(config.cqconfig.httpapi);

//const WxVoice = require('wx-voice');
//var voice = new WxVoice('./../temp/', './lib/ffmpeg-4.2.1');

var FromDis = require('./MsgHandler/FromDis');
var FromTel = require('./MsgHandler/FromTel');
var FromQQ = require('./MsgHandler/FromQQ');
console.log('Posting messages to localhost:7501');


var pref = config.CMD_PREFIX.toLowerCase();
var clients = {
  config: config,
  cmap:chanMap,
  dis:disClient,
  tel:telClient,
  qq:cqClient,
  scp:scpClient,
  //v: voice
}

// add discord bot to server: discordapp.com/oauth2/authorize?client_id=601680932860067861&scope=bot&permissions=8

// calling functions for events
function getEvents(fol, cli) {
  fs.readdir(`./EventHandler/${fol}`, (err, files) => {
    if(err) return console.error(err);
    files.forEach(file => {
      let eventFunction = require(`./EventHandler/${fol}/${file}`);
      let eventName = file.split(".")[0];
      cli.on(eventName, (...args) => eventFunction.run(clients, ...args));
    });
  });
}
getEvents("Discord",disClient);
getEvents("QQ",cqClient);
getEvents("Telegram",telClient);


//these triggers message relay
disClient.on('message', msg => {
  if (msg.author.bot&&msg.author.id!='268478587651358721') return;
  if (msg.content.toLowerCase().startsWith(pref)) return;
  if (msg.content.toLowerCase().includes(config.NO_RELAY)) return;
  //if (msg.system) return;
  for (var i in chanMap.DIS_GID) {
    if ((chanMap.DIS_GID[i] === msg.guild.id)&&(chanMap.DIS_CID[i] === msg.channel.id)) {
      FromDis.run(clients, msg)
    }
  }
});

telClient.on("message", msg => {
  if (msg.from.is_bot) return;
  if (msg.text.toLowerCase().startsWith(pref)) return;
  if (chanMap.TEL_CID.includes(msg.chat.id.toString(10))) {
    FromTel.run(clients, msg)
  }
});

cqClient.on("message", msg => {
  if (msg.message[0].type==="text" && msg.message[0].data.text.toLowerCase().startsWith(pref)) return;
  if (msg.group_id!=undefined&&chanMap.QQ_GPID.includes(msg.group_id.toString(10))) {
    FromQQ.run(clients, msg).catch(e=>{console.log(e)})
  }
});

cqClient.on("notice", msg => {
  if (msg.group_id!=undefined&&chanMap.QQ_GPID.includes(msg.group_id.toString(10))) {
    FromQQ.run(clients, msg).catch(e=>{console.log(e)})
  }
});



//responds to commands
function readcmd(fol,cli) {
  cli.cmds = new Map();
  fs.readdir(`./CmdHandler/${fol}`, (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js"
      && !["disabled.js"].includes(f.split("-").pop()))
    if(!jsfile.length) return console.log("No commands available.");

    jsfile.forEach((f, i) =>{
      let props = require(`./CmdHandler/${fol}/${f}`);
      console.log(`${f} loaded.`);
      cli.cmds.set(f.split(".").shift(), props);
    });
  });
}
readcmd("Discord",disClient);
readcmd("QQ",cqClient);

disClient.on("message", msg => {
  if (msg.author.bot) return;
  if (!msg.content.toLowerCase().startsWith(pref)) return;
  let args = msg.content.slice(pref.length).split(' ');
  for (var i=0; i<args.length; i++) {
    if (args[i]==='') { args.splice(i,1); i--};
  };
  let cmd = args.shift().toLowerCase();
  var cmdFile = disClient.cmds.get(cmd);
  if (cmdFile&&cmdFile!=undefined) {
    cmdFile.run(clients, msg, args);
  } else {
    msg.channel.send("指令不存在。使用\""+pref+"help\"尋找更多資料。\nInvalid command. See \""+pref+"help\" for more information.");
  }
});

cqClient.on("message", msg => {
  if (!(msg.message[0].type==="text" && msg.message[0].data.text.toLowerCase().startsWith(pref))) return;
  let args = msg.message[0].data.text.toLowerCase().slice(pref.length).split(' ');
  for (var i=0; i<args.length; i++) {
    if (args[i]==='') { args.splice(i,1); i--};
  };
  let cmd = args.shift().toLowerCase();
  var cmdFile = cqClient.cmds.get(cmd);
  if (cmdFile&&cmdFile!=undefined) {
    cmdFile.run(clients, msg, args);
  } else {
    cqClient('send_group_msg', {"group_id":msg.group_id,"message":`指令不存在。使用\""+pref+"help\"尋找更多資料。\nInvalid command. See \""+pref+"help\" for more information.`});
  };
});

setInterval(cqClient, 86400000, 'clean_data_dir', {"data_dir":"image"})
