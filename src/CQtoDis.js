exports.run = (client) => {
  const express = require('express');
  const fs = require("fs");
  let chanMap = JSON.parse(fs.readFileSync('./channelMapping.json', 'utf8'));
/*  const bodyParser = require('body-parser');
 *  no longer needed as the required methods comes bundled with express 4.16 onwards.
 */
  const app = express();

  app.use(express.urlencoded({extended:false}));
  app.use(express.json())

  app.listen(3000);
  console.log('Listening from CoolQ at localhost:3000');

  app.post('/', (req, res) => {
    console.log(req.body);
    if ((req.body.post_type === 'message') && (req.body.message_type === 'group')) {
      for (var i in chanMap.QQGPID) {
        if (req.body.group_id === chanMap.QQGPID[i]) {
          client.channels.get(chanMap.DisChanID[i]).send('<['+req.body.sender.title+']'+req.body.sender.card+'>: '+req.body.message);
        }
      };
    };
    res.end();
  })
}
