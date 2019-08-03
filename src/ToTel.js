exports.run = (receive, origMsgID, chanMap) => {
  const path = require("path");
  const express = require('express');
  const request = require('request');
  let TelToken = JSON.parse(fs.readFileSync('./data/config.json', 'utf8')).loginTelegram;
  const SQLite = require('better-sqlite3');
  var Transcoder = require('./../lib/Transcoder.js');
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let DToTMap = MsgMap.prepare("INSERT OR REPLACE INTO FromDis (DisMsgID, TelMsgID) VALUES (@DisMsgID, @TelMsgID);");
  let QToTMap = MsgMap.prepare("INSERT OR REPLACE INTO FromQQ (QQMsgID, TelMsgID) VALUES (@QQMsgID, @TelMsgID);");

  var optionsT = {
    uri: 'https://api.telegram.org/bot'+TelToken+'/sendMessage',
    method: 'POST',
    json: receive
  };

  request(optionsT, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      /*var debug = JSON.stringify({DisMsgID:DisMsg.id, QQMsgID:body.data.message_id})
      console.log(JSON.stringify(response));
      console.log(JSON.stringify(body));
      console.log(debug);*/
      TToQMap.run({TelMsgID:DisMsg.id, QQMsgID:body.data.message_id.toString(10)});
    }
  });
}
