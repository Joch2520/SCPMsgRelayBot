exports.run = (client) => {
  const fs = require("fs");
  const path = require("path");
  const express = require('express');
  const SQLite = require('better-sqlite3');
  const MsgMap = new SQLite(path.join(__dirname,'../data/MsgMappings.sqlite'));
  let chanMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelMapping.json'), 'utf8'));

  MsgMap.prepare("CREATE TABLE IF NOT EXISTS CQtoDis (QQMsgID TEXT PRIMARY KEY, DisMsgID TEXT);").run();
  MsgMap.prepare("CREATE TABLE IF NOT EXISTS DisToCQ (DisMsgID TEXT PRIMARY KEY, QQMsgID TEXT);").run();
  MsgMap.pragma("synchronous = 1");
  MsgMap.pragma("journal_mode = wal");

  let setMsgMap = MsgMap.prepare("INSERT OR REPLACE INTO CQtoDis (QQMsgID, DisMsgID) VALUES (@QQMsgID, @DisMsgID);");

  const app = express();

  app.use(express.urlencoded({extended:false}));
  app.use(express.json());

  app.listen(7500);
  console.log('Listening from CoolQ at localhost:7500');

  app.post('/', (req, res) => {
    //for debugging:
    /*console.log(req.body);
    console.log('<['+req.body.sender.title+']'+req.body.sender.card+'@'+req.body.group_id+'>: '+req.body.message);
    var debug = '';
    if((req.body.message_type === 'group')) {debug+=1} else {debug+=0}
    if(chanMap.QQGPID.includes(req.body.group_id.toString(10))) {debug+=1} else {debug+=0}
    if((req.body.post_type === 'message') ) {debug+=1} else {debug+=0}
    console.log(debug)*/
    //actual sending to discord
    if ((req.body.message_type === 'group') && (chanMap.QQGPID.includes(req.body.group_id.toString(10))) && (req.body.post_type === 'message')) {
      var transName = '<';
      if (req.body.sender.title) { transName += '['+req.body.sender.title+']'}
      if (req.body.sender.card) { transName += req.body.sender.card }
        else if (req.body.sender.nickname) { transName += req.body.sender.nickname }
          else if (req.body.sender.user_id) { transName += req.body.sender.user_id };
      transName += '>';
      var transMsg = '';
      for (var i = 0; i < req.body.message.length; i++) {
        var curr = req.body.message[i];
        switch (curr.type) {
          case 'text': transMsg += curr.data.text + ' '; break;
          case 'image': transMsg += curr.data.url + ' '; break;
          case 'at': transMsg += '@'+ curr.data.qq + ' '; break;
          case 'share': transMsg += curr.data.url + ' '; break;
          case 'face': transMsg += 'FaceID:' + curr.data.id + ' '; break;
          case 'emoji': transMsg += 'EmojiID:' + curr.data.id + ' '; break;
          case 'image': transMsg += curr.data.url + ' '; break;
          default: transMsg += curr + ' '; break;
        }
      }
      client.channels.get(chanMap.DisChanID[chanMap.QQGPID.indexOf(req.body.group_id.toString(10))]).send(transName + ': ' + transMsg)
        .then(message => {
          setMsgMap.run({QQMsgID:req.body.message_id, DisMsgID:message.id});
        });
    };
    res.end();
  })
}
