var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var hbs = require('hbs');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 5000);


var Message = mongoose.model('Message',{ name : String, message : String, color : String});

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
  console.log("color: "+req.body.color);
var s = req.body.name;
var m = req.body.message;
console.log(m.endsWith("/m!"));
if ((s.includes("(MOD)") || s.includes("(mod)") || s.includes("(Mod)") || s.includes("(mOd)") || s.includes("(moD)") || s.includes("(MOd)") || s.includes("(mOD)") || s.includes("(MoD)")) && m.endsWith("/m!") === false) {

req.body.name = ">> Not a Mod ("+ s +") <<";

} else if ((s.includes("(MOD)") || s.includes("(mod)") || s.includes("(Mod)") || s.includes("(mOd)") || s.includes("(moD)") || s.includes("(MOd)") || s.includes("(mOD)") || s.includes("(MoD)")) && m.endsWith("/m!") === true) {

req.body.name = s;
req.body.message = m.substr(0, m.length - 3)

}
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      res.sendStatus(500);
      io.emit('message', req.body);
    res.sendStatus(200);
  });
});

io.sockets.on('connection', function(client) {  
    console.log('Client connected or page refreshed..');
});

module.exports = app;