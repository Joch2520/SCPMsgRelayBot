exports.run = () => {
  const fs = require("fs");
  const path = require("path");
  const express = require('express');
  const https = require('https');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));
  let token = JSON.parse(fs.readFileSync(path.join(__dirname,'./../data/config.json'), 'utf8')).loginTelegram;
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let TToDMap = MsgMap.prepare("INSERT OR REPLACE INTO FromTel (TelMsgID, DisMsgID) VALUES (@TelMsgID, @DisMsgID);");
  let TToQMap = MsgMap.prepare("INSERT OR REPLACE INTO FromTel (TelMsgID, QQMsgID) VALUES (@TelMsgID, @QQMsgID);");

  const app = express();

  app.use(express.urlencoded({extended:false}));
  app.use(express.json());

  app.listen("https://api.telegram.org/bot"+token);
  console.log('Listening from Telegram at ---');
  app.post('/', (req, res) => {

  })
}
