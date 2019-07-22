const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const fs = require("fs");
var DisToCQ = require('./src/DisToCQ')
// var ServerInit = require('./src/ServerInit');
const express = require('express');
const app = express();
app.listen(3001);
console.log('Posting Discord messages to localhost:3001');

let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

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
  if(msg.author.bot) return;
  if (msg.content.toLowerCase().startsWith(pref)) return;
  for (var i in config.ReadDiscord) {
    if ((config.ReadDiscord[i].ServKey.includes(msg.guild.id,1))&&(config.ReadDiscord[i].ChanID.includes(msg.channel.id))) {
      //var j = config.ReadDiscord[i].ChanID.indexOf(msg.channel.id);
      //console.log('<'+msg.member.displayName+'('+msg.author.tag+') @'+config.ReadDiscord[i].ServKey[0]+' #'+config.ReadDiscord[i].ChanName[j]+'>: '+msg.content);
      DisToCQ.run(app, msg)
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
