// server.js
// where your node app starts

// init project
var express = require('express');
var Busboy = require('busboy');
//var Busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra'); 
var app = express();
//app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.route('/upload')
    .post(function (req, res, next) {

        var upload_filesize = 0;
        var upload_filename = "";
        
  console.log(req.headers);
        var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename);
      upload_filename = filename;
      file.on('data', function(data) {
        
        upload_filesize +=data.length;
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + val);
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.send({"filename": upload_filename,"size":upload_filesize});
      res.end();
    });
    req.pipe(busboy);
    });


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
