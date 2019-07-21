exports.run = (app, DisMsg) => {
  const fs = require("fs");
  const path = require("path");
  const express = require('express');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite('./../data/MsgMappings.sqlite');
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  const DisToCQ = MsgMap.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'DisToCQ';").get();
  if (!DisToCQ['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    MsgMap.prepare("CREATE TABLE DisToCQ (DisMsgID TEXT PRIMARY KEY, QQMsgID TEXT);").run();
    MsgMap.pragma("synchronous = 1");
    MsgMap.pragma("journal_mode = wal");
  };

  let setMsgMap = MsgMap.prepare("INSERT OR REPLACE INTO DisToCQ (DisMsgID, QQMsgID) VALUES (@DisMsgID, @QQMsgID);");

  app.use(express.urlencoded({extended:false}));
  app.use(express.json());

  for (var i in chanMap.DisChanID) {
    if ( DisMsg.channel.id === chanMap.DisChanID[i]) {
      var CQMsg = { "group_id":"", "message":"" }
      CQMsg.group_id = chanMap.QQGPID[i];
      CQMsg.message = '<'+DisMsg.member.displayName+'>: '+DisMsg.content;
      var URLReq = '/send_group_message?json=' + encodeURI(JSON.stringify(CQMsg))
      app.get(URLReq, (req, res) => {
        setMsgMap.run({DisMsgID:DisMsg.id, QQMsgID:req.body.message_id});
      });
    }
  };
}
