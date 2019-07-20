(function(){
  const express = require('express');
/*  const bodyParser = require('body-parser');
 *  no longer needed as the required methods comes bundled with express 4.16 onwards.
 */
  const app = express();

  app.use(express.urlencoded({extended:false}));
  app.use(express.json())

  app.post('/', (req, res) => {
    console.log(req.body);
    res.end();
  })
  app.listen(3000);
  console.log('Listening from localhost:3000');
}).call(this);
