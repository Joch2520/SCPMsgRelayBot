const fs = require("fs");
const path = require('path');
let config = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/config.json'), 'utf8'));
let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/channelMapping.json'), 'utf8'));

const Discord = require('discord.js');
const disClient = new Discord.Client({ autoReconnect: true });
disClient.login(config.loginDiscord);

const Telegram = require("node-telegram-bot-api");
const telClient = new Telegram(config.loginTelegram, {polling: true});

const CQHTTP = require('cqhttp')
const CQWS = require('cq-websocket');
const cqClient = new CQHTTP(config.cqconfig.http);

var FromDis = require('./MsgHandler/FromDis');
var FromTel = require('./MsgHandler/FromTel');
var FromQQ = require('./MsgHandler/FromQQ');
console.log('Posting messages to localhost:7501');


var pref = config.prefix.toLowerCase();
var clients = {
  dis:disClient,
  tel:telClient,
  qq:cqClient
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


//this reads message from specific Discord channels
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

//discord commands
disClient.on("message", msg => {
  if (msg.author.bot) return;
  if (!msg.content.toLowerCase().startsWith(pref)) return;
  let args = msg.content.slice(pref.length).split(' ');
  if (args[0]==='') { args.shift(); };
  let cmd = args[0].toLowerCase();
  args.shift();
  var cmdFile;
  try {
    cmdFile = require(`./commands/${cmd}.js`);
    cmdFile.run(disClient, msg, args);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') { console.log(e); }
  };
});

// telegram

telClient.on("message", msg => {
  if (msg.from.is_bot) return;
  if (msg.text.toLowerCase().startsWith(pref)) return;
  if (chanMap.TelChatID.includes(msg.chat.id.toString(10))) {
    FromTel.run(clients, msg)
  }

})

// qq

cqClient.on(("message"||"notice"), msg => {
  if (msg.from.is_bot) return;
  if (msg.text.toLowerCase().startsWith(pref)) return;
  if (chanMap.TelChatID.includes(msg.chat.id.toString(10))) {
    FromQQ.run(clients, msg)
  }

})
