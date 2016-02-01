var express = require('express');
var path = require('path');
var ejs = require('ejs');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var socketIO = require('socket.io');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({ url: 'mongodb://localhost:27017/ChatRoom' });
var port = process.env.PORT || 3000;
var Controllers = require('./controllers');
var signedCookieParser = cookieParser('ChatRoom');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: 'ChatRoom',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 },
    store: sessionStore
}));

app.use(express.static(path.join(__dirname, 'app')));

app.get('/api/validate', function (req, res) {
    var _userId = req.session._userId;
    if (_userId) {
        Controllers.User.findUserById(_userId, function (err, user) {
            if (err) {
                res.status(401).json({ msg: err });
            }
        });
    }
    else {
        res.status(401).json("");
    }
});

app.post('/api/login', function (req, res) {
    var email = req.body.email;
    if (email) {
        Controllers.User.findByEmailOrCreate(email, function (err, user) {
            if (err)
                res.status(500).json({ msg: err });
        });
    }
    else {
        res.status(403).json("");
    }
});

app.get('/api/logout', function (req, res) {
    res.session._userId = null;
    res.status(401).json("");
});

app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(methodOverride());

app.get('/', function (req, res) {
    res.sendfile('app/index.html');
});

app.set('port', port);
var server = app.listen(port, function () {
    console.log('MultiChatRoom is on port ' + app.get('port') + '!');
});

if (app.get('dev') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

var io = socketIO.listen(server);

var messages = [];

io.set('authorization', function (handshakeData, accept) {
    signedCookieParser(handshakeData, {}, function (err) {
        if (err) {
            accept(err.message, false);
        } else {
            sessionStore.get(handshakeData.signedCookies['connect.sid'], function (err, session) {
                if (err) {
                    accept(err.message, false);
                } else {
                    handshakeData.session = session;
                    if (session._userId) {
                        accept(null, true);
                    } else {
                        accept('No login');
                    }
                }
            });
        };
    });
});

// 全局见Sockect消息的监听
io.sockets.on('connection', function (socket) {
    socket.on('messages.read', function () {
        socket.emit('messages.read', messages);
    });
    socket.on('messages.create', function (message) {
        messages.push(message);
        io.sockets.emit('messages.add', message);
    });
});

module.exports = app;