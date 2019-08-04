const fs = require("fs");
let config = JSON.parse(fs.readFileSync('./data/config.json', 'utf8'));
let chanMap = JSON.parse(fs.readFileSync('./data/channelMapping.json', 'utf8'));

const Discord = require('discord.js');
const disClient = new Discord.Client({ autoReconnect: true });
disClient.login(config.loginDiscord);

const Telegram = require("node-telegram-bot-api");
const telClient = new Telegram(config.loginTelegram, {polling: true});

var FromDis = require('./src/FromDis');
var FromTel = require('./src/FromTel');
// var ServerInit = require('./src/ServerInit');
console.log('Posting Discord messages to localhost:7501');


var pref = config.prefix.toLowerCase();

// add discord bot to server: discordapp.com/oauth2/authorize?client_id=601680932860067861&scope=bot&permissions=240640

// calling functions for discord events
fs.readdir("./events/Discord", (err, files) => {
  if(err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/Discord/${file}`);
    let eventName = file.split(".")[0];
    disClient.on(eventName, (...args) => eventFunction.run(disClient,telClient, ...args));
  });
});
// calling functions for telegram events
fs.readdir("./events/Telegram", (err, files) => {
  if(err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/Telegram/${file}`);
    let eventName = file.split(".")[0];
    telClient.on(eventName, (...args) => eventFunction.run(telClient, ...args));
  });
});


//this reads message from specific Discord channels
disClient.on('message', msg => {
  if (msg.author.bot) return;
  if (msg.content.toLowerCase().startsWith(pref)) return;
  if (msg.system) return;
  for (var i in chanMap.DisGuildID) {
    if ((chanMap.DisGuildID[i] === msg.guild.id)&&(chanMap.DisChanID[i] === msg.channel.id)) {
      FromDis.run(msg)
    }
  }
});

//commands
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
  if (chanMap.TelChatID.hasOwnProperty(msg.chat.id)) {

  }
  for (var i in chanMap.TelChatID) {
    if (chanMap.TelChatID[i] === msg.chat.id) {
      FromTel.run(msg)
    }
  }
})
