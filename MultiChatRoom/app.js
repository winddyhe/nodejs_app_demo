var express = require('express');
var path = require('path');
var ejs = require('ejs');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var socketIO = require('socket.io');
var app = express();
var server = require('http').createServer(app);

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'app')));
app.get('/', function(req, res){
    res.sendfile('app/index.html');
});

if (app.get('dev') === 'development') 
{
    app.use(function(err, req, res, next) 
    {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

var io = socketIO.listen(app.listen(app.get('port')));
 
io.sockets.on('connection', function(socket){
   socket.emit('connected'); 
});


// server.listen(app.get('port'), function(){
//     console.log('Express server listening on port ' + app.get('port') + '.');
// });

module.exports = app;