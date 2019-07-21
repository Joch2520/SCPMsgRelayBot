exports.run = (client) => {
  const fs = require("fs");
  const path = require("path");
  const express = require('express');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite('./../data/MsgMappings.sqlite');
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  const CQtoDis = MsgMap.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'CQtoDis';").get();
  if (!CQtoDis['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    MsgMap.prepare("CREATE TABLE CQtoDis (QQMsgID TEXT PRIMARY KEY, DisMsgID TEXT);").run();
    MsgMap.pragma("synchronous = 1");
    MsgMap.pragma("journal_mode = wal");
  };

  let setMsgMap = MsgMap.prepare("INSERT OR REPLACE INTO CQtoDis (QQMsgID, DisMsgID) VALUES (@QQMsgID, @DisMsgID);");

  const app = express();

  app.use(express.urlencoded({extended:false}));
  app.use(express.json());

  app.listen(3000);
  console.log('Listening from CoolQ at localhost:3000');

  app.post('/', (req, res) => {
    console.log(req.body);
    if ((req.body.post_type === 'message') && (req.body.message_type === 'group')) {
      for (var i in chanMap.QQGPID) {
        if (req.body.group_id === chanMap.QQGPID[i]) {
          client.channels.get(chanMap.DisChanID[i]).send('<['+req.body.sender.title+']'+req.body.sender.card+'>: '+req.body.message)
            .then(message => {
              setMsgMap.run({QQMsgID:req.body.message_id, DisMsgID:message.id});
            });
        }
      };
    };
    res.end();
  })
}
