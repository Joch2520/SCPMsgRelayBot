exports.run = (disClient,telClient) => {
  const path = require("path");
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  MsgMap.prepare("CREATE TABLE IF NOT EXISTS FromQQ (QQMsgID TEXT PRIMARY KEY, DisMsgID TEXT, TelMsgID TEXT);").run();
  MsgMap.prepare("CREATE TABLE IF NOT EXISTS FromDis (DisMsgID TEXT PRIMARY KEY, QQMsgID TEXT, TelMsgID TEXT);").run();
  MsgMap.prepare("CREATE TABLE IF NOT EXISTS FromTel (TelMsgID TEXT PRIMARY KEY, DisMsgID TEXT, QQMsgID TEXT);").run();

  console.log(`Discord logged in as ${disClient.user.tag}.`);
  console.log(`Ready to serve in ${disClient.channels.size} channels on ${disClient.guilds.size} servers, for a total of ${disClient.users.size} users.`);
  var FromQQ = require('./../../src/FromQQ');
  FromQQ.run(disClient,telClient);
  var FromTel = require('./../../src/FromTel');
  FromTel.run();
}
