exports.run = (client) => {
  const path = require("path");
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  MsgMap.prepare("CREATE TABLE IF NOT EXISTS FromQQ (QQMsgID TEXT PRIMARY KEY, DisMsgID TEXT, TelMsgID TEXT);").run();
  MsgMap.prepare("CREATE TABLE IF NOT EXISTS FromDis (DisMsgID TEXT PRIMARY KEY, QQMsgID TEXT, TelMsgID TEXT);").run();
  MsgMap.prepare("CREATE TABLE IF NOT EXISTS FromTel (TelMsgID TEXT PRIMARY KEY, DisMsgID TEXT, QQMsgID TEXT);").run();

  console.log(`Discord logged in as ${client.user.tag}.`);
  console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
  var FromQQ = require('./../../src/FromQQ');
  FromQQ.run(client);
  var FromTel = require('./../../src/FromTel');
  FromTel.run();
}
