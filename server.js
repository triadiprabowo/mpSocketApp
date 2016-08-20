/*
** Socket Server for Semen Merah Putih Application
** Dep Node.js
** @author: Triadi Prabowo
*/

// Require dependencies
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	gcm = require('node-gcm'),
	parseJson = require('parse-json'),
	host = '127.0.0.1',
	port = 3002;

// Registering Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	return next();
});

app.get('/', function(req, res, next) {
	res.send('<h1>Semen Merah Putih Application Socket Server</h1>');
});

// SocketIO Connection Configuration
io.on('connection', function(socket) {
	console.log('a user connected');

	// Event 'test-event'
	socket.on('test-event', function(data) {
		console.log(data);
	});

	// Init Chat
	socket.on('init_chat', function(data) {	
		if(socket.room == data) return;
		socket.leave(socket.room);
		socket.join(data);
		socket.room = data;
	});

	// Start Typing
	socket.on('startTyping', function(data) {
		io.to(data.roomId).emit('u2_startTyping', data);
	});

	socket.on('stopTyping', function(data) {
		io.to(data.roomId).emit('u2_stopTyping', data);
	});
});

app.post('/sendMessage', function(req, res, next) {
	console.log(JSON.stringify(req.body.chatData));

	/*var userdata = JSON.parse(req.body.userData),
		chatdata = JSON.parse(req.body.chatData);

	io.to(req.body.roomId).emit('messageReceived', chatdata);
	io.emit('notif_msg_unread', chatdata);
	
	var sender = new gcm.Sender('AIzaSyCL4L12p-bjEkx8Z_kXBze4zHcHEzdUYiM'),
		message = new gcm.Message();

	// Set-up message data
	message.addData('title', 'New Message!');
	message.addData('message', chatdata[chatdata.length-1].chat);
	message.addData('sound', 'notification');
	message.collapseKey = 'chatting';
	message.delayWhileIdle = true;
	message.timeToLive = 3;

	if(userdata.token) {
		sender.send(message, [userdata.token], 4, function(result) {
			// Check if success / print the result
			res.send(result);
		});	
	}
	else {
		res.send('Success');
	}*/
	
});

// Running Server
http.listen(port, function() {
	console.log('Socket server running in '+host+':'+port);
});
