// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
mongoose.connect(`mongodb://`+ process.env.USERNAME + ':' + process.env.PASSWORD +`@` +process.env.MONGO_URL,{ useNewUrlParser: true })
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error: ' + err)
       })
autoIncrement.initialize(mongoose.connection);
var shortenUrlModel = require('./models/shortenUrl');
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.set('view engine', 'pug')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.render(__dirname + '/views/index',{title:"Shorten URL",message:"Enter url"});
});

app.post('/shorten_url/', function(request, response) {
  
  if (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(request.body.input_url)){
    var shortenUrl = new shortenUrlModel({
    originalUrl :request.body.input_url

});
    shortenUrl.save()
   .then(doc => {
     console.log(doc)
      response.send( {"original_url":request.body.input_url,"short_url":doc._id});
   })
   .catch(err => {
      response.send( {"save database error":err});
   })
     
  }else
  {
     response.send( {"error":"invalid URL"});
  }
 
});

app.post('/api/shorturl/new/:input_url(*)', function(request,response)
{
  var original_url = request.params.new;

  
   if (/((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(request.params.input_url)){
     
   
      var shortenUrl = new shortenUrlModel({
    originalUrl :request.params.input_url

});
    shortenUrl.save()
   .then(doc => {
     console.log(doc)
      response.send( {"original_url":request.params.input_url,"short_url":doc._id});
   })
   .catch(err => {
      response.send( {"save database error":err});
   })
     //response.send( {"error":"accept"});
  }else
  {
     response.send( {"error":"invalid URL"});
  }
  
});


app.get('/api/shorten_url/:id', function(request, response) {
  
  console.log("id: " + request.params.id );
  shortenUrlModel.findOne({
    _id: request.params.id   // search query
  }) .then(doc => {
    //response.send( {"error":doc});\
 
    var targetUrl = doc.originalUrl;
    console.log("before check re: " + targetUrl);
    var re = new RegExp('((ftp|http|https))');
    if (re.test(targetUrl))
  {
    
    console.log("test success");
    response.redirect(301, targetUrl);
  }else
  {
    console.log("test fail");
    targetUrl = "http://" + targetUrl;
    console.log("target has parse: " + targetUrl);
    response.redirect(301, targetUrl);
  }
   
  })
  .catch(err => {
    response.send( {"error":err});
  });
 
});

function handleRedirect(req, res) {
  const targetUrl = req.originalUrl;
  
  res.redirect(targetUrl);
}
app.get('*', handleRedirect);

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
