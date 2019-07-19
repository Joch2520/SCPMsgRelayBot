const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const fs = require("fs");

let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
var pref = config.prefix.toLowerCase();
// add bot to server: discordapp.com/oauth2/authorize?client_id=601680932860067861&scope=bot&permissions=240640

client.on('ready', () => {
  console.log(`Discord logged in as ${client.user.tag}.`);
});

client.login(config.loginDQ);

fs.readdir("./events/", (err, files) => {
  if(err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `bot` var.
    client.on(eventName, (...args) => eventFunction.run(bot, ...args));
  });
});

//this reads message from specific Discord channels
client.on('message', msg => {
  if(msg.author.bot) return;
  for (var i in config.ReadDiscord) {
    if ((config.ReadDiscord[i].ServKey.includes(msg.guild.id,1))&&(config.ReadDiscord[i].ChanID.includes(msg.channel.id))) {
      var j = config.ReadDiscord[i].ChanID.indexOf(msg.channel.id);
      console.log('<'+msg.member.displayName+' @'+config.ReadDiscord[i].ServKey[0]+' #'+config.ReadDiscord[i].ChanName[j]+'>: '+msg.content);
    }
  }
});

//commands
client.on("message", msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(pref)) return;
  let args = msg.content.slice(pref.length).split(' ');
  if (args[0]==='') { args.shift(); };
  let cmd = args[0].toLowerCase();
  args.shift();

  let cmdFile = require(`./commands/${cmd}.js`);
  cmdFile.run(client, msg, args);
});
