exports.run = (client, oldMsg, newMsg) => {
  const fs = require("fs");
  const path = require("path");
  const express = require('express');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../../data/MsgMappings.sqlite'));
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  MsgMap.prepare("CREATE TABLE IF NOT EXISTS DisToCQ (DisMsgID TEXT PRIMARY KEY, QQMsgID TEXT);").run();
  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let setMsgMap = MsgMap.prepare("INSERT OR REPLACE INTO DisToCQ (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");

  const app = express();
  app.use(express.urlencoded({extended:false}));
  app.use(express.json());

  let QQMsgID = MsgMap.prepare('SELECT QQMsgID FROM DisToCQ WHERE DisMsgID = ?').get(oldMsg.id);
  if (QQMsgID) {
    var deleted = {"message_id":""};
    deleted.message_id = QQMsgID;
    app.get('/delete_msg?json='+encodeURI(JSON.stringify(deleted)));
    var CQMsg = { "group_id":"", "message":"" }
    CQMsg.group_id = chanMap.QQGPID[i];
    CQMsg.message = '<'+newMsg.member.displayName+'>: '+newMsg.content;
    var URLReq = '/send_group_message?json=' + encodeURI(JSON.stringify(CQMsg));
    app.get(URLReq, (req, res) => {
      setMsgMap.run({DisMsgID:newMsg.id, QQMsgID:req.body.message_id});
    })
  };
}
