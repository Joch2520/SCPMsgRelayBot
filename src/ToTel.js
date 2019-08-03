exports.run = (receive, src) => {
  const path = require("path");
  const express = require('express');
  const request = require('request');
  let TelToken = JSON.parse(fs.readFileSync('./data/config.json', 'utf8')).loginTelegram;
  const SQLite = require('better-sqlite3');
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
    if (!error && response.ok) {
      /*var debug = JSON.stringify({DisMsgID:DisMsg.id, QQMsgID:body.data.message_id})
      console.log(JSON.stringify(response));
      console.log(JSON.stringify(body));
      console.log(debug);*/
      if (src.from.toLowerCase === "qq") { QToTMap.run({QQMsgID:src.id, TelMsgID:body.result.message_id.toString(10)}); }
      if (src.from.toLowerCase === "dis") { DToTMap.run({DisMsgID:src.id, TelMsgID:body.result.message_id.toString(10)}); }
    }
  });
}
