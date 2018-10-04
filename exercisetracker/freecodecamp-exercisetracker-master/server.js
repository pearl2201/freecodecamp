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
mongoose.connect(`mongodb://` + process.env.USERNAME + ':' + process.env.PASSWORD + `@` + process.env.MONGO_URL, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('Database connection successful')
    })
    .catch(err => {
        console.error('Database connection error: ' + err)
    })
autoIncrement.initialize(mongoose.connection);
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.set('view engine', 'pug')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())


function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format
    var d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return false; // Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}

var userModel = require('./models/user');
var exerciseModel = require('./models/exercise');

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
    response.render(__dirname + '/views/index', {
        title: "Shorten URL",
        message: "Enter url"
    });
});

app.post('/api/exercise/new-user', function(request, response) {

    var user = new userModel({
        username: request.body.username
    });
    user.save()
        .then(doc => {
            console.log(doc)
            response.send(doc);

        })
        .catch(err => {
            response.send({
                "save database error": err
            });
        })


});

app.post('/api/exercise/add', function(request, response) {

    userModel.findOne({
            _id: Number(request.body.userId) // search query
        }).then(doc => {
            var exercise = new exerciseModel({
                userId: doc.id,
                date: request.body.date,
                description: request.body.description,
                duration: request.body.duration
            });
            exercise.save().then(doc => {
                response.send({
                    "user": doc
                });
            }).catch(err => {
                console.log(err);
                response.send({
                    "error save exercise": err
                });
            });
        })
        .catch(err => {
            response.send({
                "error": err
            });
        });
});

app.get('/api/exercise/log', function(request, response) {

    if (request.query.userId) {
        var cmd = {
            userId: Number(request.query.userId)

        };
        if (request.query.from || request.query.to) {
            cmd.date = {};
            if (request.query.from) {
                cmd.date.$gte = new Date(request.query.from);
            }
            if (request.query.to) {
                cmd.date.$lte = new Date(request.query.to);
            }
        }

        exerciseModel.find(cmd).limit(Number(request.query.limit)).then(doc => {
                response.send(doc);
            })
            .catch(err => {
                response.send({
                    "error": err
                });
            });
    }

});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});