exports.run = (app, DisMsg) => {
  const fs = require("fs");
  const path = require("path");
  const express = require('express');
  let chanMap = JSON.parse(fs.readFileSync('./channelMapping.json', 'utf8'));
  let MsgIDs = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/MsgIDs.json'), 'utf8'));

  app.use(express.urlencoded({extended:false}));
  app.use(express.json());

  for (var i in chanMap.DisChanID) {
    if ( DisMsg.channel.id === chanMap.DisChanID[i]) {
      var CQMsg = { "group_id":"", "message":"" }
      CQMsg.group_id = chanMap.QQGPID[i];
      CQMsg.message = '<'+DisMsg.member.displayName+'>: '+DisMsg.content;
      var URLReq = '/send_group_message?json=' + encodeURI(JSON.stringify(CQMsg))
      app.get(URLReq, (req, res) => {
        MsgIDs.DisToCQ[DisMsg.channel.id] = req.body.message_id;
      });
    }
  };
}
