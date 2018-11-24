var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var hbs = require('hbs');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var app = express();
app.set('port', process.env.PORT || 4000);
var server = app.listen(app.get('port'), function() {
	// log a message to console!
    console.error('Port at 4k');
});
var io = require('socket.io').listen(server);


var Message = mongoose.model('Message',{ name : String, message : String});

var indexRouter = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var mongoose = require('mongoose');
mongoose.connect('mongodb://dec0mpiled:welcometor4ge@ds023480.mlab.com:23480/chatapp', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("SUCCESS: Connected to the Database. Connect at: " + server.address().port);
});

app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  });
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      res.sendStatus(500);
      io.emit('message', req.body);
    res.sendStatus(200);
  });
});

app.get('/delete/:id', (req, res) => {
  Message.findOne({"_id":req.params.id},(err, message)=> {
	message.delete();
  Message.find({},(err, messages)=> {
    res.send(messages);
  });
  });
});

io.on('connection', function(client) {  
    console.log('Client connected or page refreshed..');
});

module.exports = app;