var http = require('http');
var express = require('express');
var app = express();
var port = 3000;
var httpServer = http.createServer(app).listen(port, function (req, res) {
});

var io = require('socket.io').listen(httpServer);

var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "192.168.0.20",
    port: 3306,
    user: "root",
    password: "",
    database: "chatapp"
});

connection.connect();

var roomList = [];

io.on('connection', function (socket) {

    socket.on('RegisterUser', function (data) {

        var json = JSON.parse(data);
        var sqlQuery = "INSERT INTO user SET ?"
        var post = {user_id: json.userId, user_password: json.userPassword, user_nickname: json.userNickname};

        connection.query(sqlQuery, post, function (err, result) {
            if(err == null){
                socket.emit('RegisterUserRes', 1);
                console.log(json.userId + "회원가입 SUC")
            }else {
                socket.emit('RegisterUserRes', 0);
            }
        });
    });

    socket.on('Login', function (data) {
        var json = JSON.parse(data);
        var sqlQuery = "SELET user_password FROM user WHERE id = " + json.userId;
        connection.query(sqlQuery, function (err, result) {
            if(err == null){
                socket.emit('RegisterUserRes', 1);

            }else {
                socket.emit('RegisterUserRes', 0);
            }
        });
    });
});

function Room(roomName, masterSessionId) {
    this.roomName = roomName;
    this.masterSessionId = masterSessionId;
    this.userSessIonId;

};