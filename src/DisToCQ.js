exports.run = (app, DisMsg) => {
  const express = require('express');
  const fs = require("fs");
  let chanMap = JSON.parse(fs.readFileSync('./channelMapping.json', 'utf8'));

  app.use(express.urlencoded({extended:false}));
  app.use(express.json());

  for (var i in chanMap.DisChanID) {
    if ( DisMsg.channel.id === chanMap.DisChanID[i]) {
      var CQMsg = { "group_id":"", "message":"" }
      CQMsg.group_id = chanMap.QQGPID[i];
      CQMsg.message = '<'+DisMsg.member.displayName+'>: '+DisMsg.content;
      var URLReq = '/send_group_message' + JSON.stringify(CQMsg)
      app.get(URLReq, (req, res) => {
        req.body.message_id
      });
    }
  };
}
