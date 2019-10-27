const fs = require("fs");
const path = require('path');
const config = require('./lib/CnfgLoader');
let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/channelMapping.json'), 'utf8'));

const Scpper = require('scpper.js');
const scpClient = new Scpper.Scpper({site: config.SCP_SITE});

const Discord = require('discord.js');
const disClient = new Discord.Client({ autoReconnect: true });
disClient.login(config.DIS_TOKEN);

const Telegram = require("node-telegram-bot-api");
const telClient = new Telegram(config.TEL_TOKEN, {polling: true});

const CQHTTP = require('cqhttp')
const CQWS = require('cq-websocket');
const cqClient = new CQHTTP(config.cqconfig.httpapi);

var FromDis = require('./MsgHandler/FromDis');
var FromTel = require('./MsgHandler/FromTel');
var FromQQ = require('./MsgHandler/FromQQ');
console.log('Posting messages to localhost:7501');


var pref = config.CMD_PREFIX.toLowerCase();
var clients = {
  dis:disClient,
  tel:telClient,
  qq:cqClient,
  scp:scpClient
}

// add discord bot to server: discordapp.com/oauth2/authorize?client_id=601680932860067861&scope=bot&permissions=240640

// calling functions for events
fs.readdir("./EventHandler/Discord", (err, files) => {
  if(err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./EventHandler/Discord/${file}`);
    let eventName = file.split(".")[0];
    disClient.on(eventName, (...args) => eventFunction.run(clients, ...args));
  });
});
fs.readdir("./EventHandler/Telegram", (err, files) => {
  if(err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./EventHandler/Telegram/${file}`);
    let eventName = file.split(".")[0];
    telClient.on(eventName, (...args) => eventFunction.run(clients, ...args));
  });
});
fs.readdir("./EventHandler/QQ", (err, files) => {
  if(err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./EventHandler/QQ/${file}`);
    let eventName = file.split(".")[0];
    cqClient.on(eventName, (...args) => eventFunction.run(clients, ...args));
  });
});


//these triggers message relay
disClient.on('message', msg => {
  if (msg.author.bot) return;
  if (msg.content.toLowerCase().startsWith(pref)) return;
  //if (msg.system) return;
  for (var i in chanMap.DisGuildID) {
    if ((chanMap.DisGuildID[i] === msg.guild.id)&&(chanMap.DisChanID[i] === msg.channel.id)) {
      FromDis.run(clients, msg)
    }
  }
});

telClient.on("message", msg => {
  if (msg.from.is_bot) return;
  if (msg.text.toLowerCase().startsWith(pref)) return;
  if (chanMap.TelChatID.includes(msg.chat.id.toString(10))) {
    FromTel.run(clients, msg)
  }
});

cqClient.on(("message"||"notice"), msg => {
  if (msg.message[0].type==="text" && msg.message[0].data.text.toLowerCase().startsWith(pref)) return;
  if (chanMap.QQGPID.includes(msg.group_id.toString(10))) {
    FromQQ.run(clients, msg)
  }
});



//responds to commands
disClient.on("message", msg => {
  if (msg.author.bot) return;
  if (!msg.content.toLowerCase().startsWith(pref)) return;
  let args = msg.content.slice(pref.length).split(' ');
  for (var i=0; i<args.length; i++) {
    if (args[i]==='') { args.splice(i,1); i--};
  };
  let cmd = args[0].toLowerCase();
  args.shift();
  var cmdFile;
  try {
    cmdFile = require(`./CmdHandler/Discord/${cmd}.js`);
    cmdFile.run(clients, msg, args);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      msg.channel.send("指令不存在。使用\""+pref+"help\"尋找更多資料。\nInvalid command. See \""+pref+"help\" for more information.");
    } else { console.log(e); }
  };
});