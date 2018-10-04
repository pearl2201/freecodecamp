// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/api/timestamp/:timestamp', function(request, response) {
  var ret = Date.parse(request.params.timestamp);
  //response.send({"ret":ret});
  
  if (!ret || ret === undefined || ret === null || ret === NaN) 
  {
    response.send({"error" : "Invalid Date"});
  }
  else 
  {
    var date = new Date(ret);
    response.send({"unix": date.getTime(), "utc" : date.toUTCString()});
  }
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
