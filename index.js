'use strict';

//setup server vars
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const INDEX = path.join(__dirname, '/views/pages/index.ejs');

//express index page
const server = express()
  .use((req, res) => res.render(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

//socketio server init
const io = socketIO(server);

var users = [];
var username, useraddress, userid;
var nusers = 0;
//users list

function user(name, id, address) {


	this.uname = name;
	this.uid = id;
    	this.address = address;
	this.isOnline = true;

}

//open port on 3000
app.listen(3000);

//express init
//app.use(express.static(__dirname + '/public'));

//views directory
//app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


function userLogin(name){
	var isFound = false;

	users.forEach(function(user){
		if(user.uname == name){
			console.log(user.uname + " " + name);
			isFound = true;	
		
		}
		else{
			
		}
	});

	if(!isFound){
		users.push(new user(name, users.length, useraddress));		
		return(false);
	}
	else{
		
		return(true);
	}
}

app.get('/', function(req,res){
	res.sendFile('index.html');
});
//when new socketio client connects
io.on('connection', (socket) => {
	//define new event handlers
	console.log('Client connected: ', socket.handshake.address);

	username = "";
	userid = users.length;
	useraddress = socket.handshake.headers;
	
	//print userlist
	console.log("Ulist: ", users.length);

	//when client disconnects
	socket.on('disconnect', function(message){

		console.log('Client disconnected', message);
		//socket.removeAllListeners();
		//socket.removeAllListeners("Disconnect");
		//io.removeAllListeners("connection");		
	});
	//when requests new uid
	socket.on('login', function(message){
		console.log(message);	
		var auth = userLogin(message.msg);
		socket.emit('login', {msg: users});
		if(auth){
			console.log("User found");
		}
		else{
			console.log("User joined");
		}
		socket.broadcast.emit('newuser', {msg: users});
	});
	//when client sends generic message
	console.log('message event listener created');
	socket.on('message', function(message){
		console.log("message: " + message);
		socket.broadcast.emit('message', {msg: message});
	});
});

		
