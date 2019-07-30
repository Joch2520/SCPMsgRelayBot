const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const fs = require("fs");
const path = require("path");
var DisToCQ = require('./src/DisToCQ')
// var ServerInit = require('./src/ServerInit');
console.log('Posting Discord messages to localhost:7501');

let config = JSON.parse(fs.readFileSync('./data/config.json', 'utf8'));
let chanMap = JSON.parse(fs.readFileSync('./data/channelMapping.json', 'utf8'));

var pref = config.prefix.toLowerCase();
// add bot to server: discordapp.com/oauth2/authorize?client_id=601680932860067861&scope=bot&permissions=240640


client.login(config.loginDiscord);

// calling functions for events
fs.readdir("./events/Discord", (err, files) => {
  if(err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/Discord/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});


//this reads message from specific Discord channels
client.on('message', msg => {
  if (msg.author.bot) return;
  if (msg.content.toLowerCase().startsWith(pref)) return;
  if (msg.system) return;
  for (var i in chanMap.DisGuildID) {
    if ((chanMap.DisGuildID[i] === msg.guild.id)&&(chanMap.DisChanID[i] === msg.channel.id)) {
      DisToCQ.run(msg)
    }
  }
});

//commands
client.on("message", msg => {
  if (msg.author.bot) return;
  if (!msg.content.toLowerCase().startsWith(pref)) return;
  let args = msg.content.slice(pref.length).split(' ');
  if (args[0]==='') { args.shift(); };
  let cmd = args[0].toLowerCase();
  args.shift();
  var cmdFile;
  try {
    cmdFile = require(`./commands/${cmd}.js`);
    cmdFile.run(client, msg, args);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') { console.log(e); }
  };
});
