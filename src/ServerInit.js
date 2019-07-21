(function(){
  const express = require('express');
/*  const bodyParser = require('body-parser');
 *  no longer needed as the required methods comes bundled with express 4.16 onwards.
 */
  const app = express();

  app.use(express.urlencoded({extended:false}));
  app.use(express.json())

  app.get('/', (req, res) => {
    res.send('Server at localhost: 3001');
  })
  app.listen(3001);
  console.log('Server initiated at localhost:3001');
}).call(this);
