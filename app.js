var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var httpServer = http.createServer(app).listen(port,function (req,res) {
});

var io = require('socket.io').listen(httpServer);

var roomList = [];

app.get('/getCheckId',function (req,res){
   res.end("");
});

function Room(roomName, masterSessionId) {
    this.roomName = roomName;
    this.masterSessionId = masterSessionId;
    this.userSessIonId;
   
};