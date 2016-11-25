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

io.on('connection', function (socket) {
       socket.on('RegisterUser', function (data) {
        var json = JSON.parse(data);
        var sqlQuery = "SELECT user_id FROM user WHERE user_id = '" + json.is + "';";
      connection.query(sqlQuery, function(err , result){
         if(err == null){
            if (result.length == 0){
            var sqlQuery = "INSERT INTO user SET ?"
              var post = {user_id: json.userId, user_password: json.userPassword, user_nickname: json.userNickname};

              connection.query(sqlQuery, post, function (err, result) {
                  if (err == null) {
                      socket.emit('RegisterUserRes', 1);
                      console.log(json.userId + "회원가입 SUC")
                  } else {
                      socket.emit('RegisterUserRes', 0);
                  }
              });
            }else{
                socket.emit('RegisterUserRes', 0);
            }
         }
      });
    });

    socket.on('Login', function (data) {
        var json = JSON.parse(data);
        var sqlQuery = "SELECT user_password FROM user WHERE user_id = '" + json.id + "'";
        connection.query(sqlQuery, function (err, result) {
            if (err == null) {
                if (result[0] != null) {
                    var passwordCheck = json.password == result[0].user_password;
                    if (passwordCheck) {
                        var sqlQuery = "SELECT user_nickname FROM user WHERE user_id = '" + json.id + "'";
                        connection.query(sqlQuery, function (err, result) {
                            if (err == null) {
                                if (result[0] != null) {
                                    socket.emit('LoginRes', result[0].user_nickname);
                                } else {
                                    socket.emit('LoginRes', 0);
                                }
                            } else {
                                socket.emit('LoginRes', 0);
                            }
                        });

                    } else {
                        socket.emit('LoginRes', 0);
                    }
                } else {
                    socket.emit('LoginRes', 0);
                }
            } else {
                socket.emit('LoginRes', 0);
            }
        });
    });

    socket.on('AddFriend', function (data) {
        var json = JSON.parse(data);
        var sqlQuery = "SELECT friend_nickname FROM friend WHERE user_nickname = '" + json.user_nickname + "'";
        connection.query(sqlQuery, function (err , result) {
            if(err == null){
                if(result.length == 0){
                    var sqlQuery = "SELECT user_nickname FROM user WHERE user_nickname = '" + json.friendNickname + "'";
                    connection.query(sqlQuery, function (err, result) {
                        if (err == null) {
                            if (result[0] != null) {
                                var sqlQuery = "SELECT user_nickname FROM user WHERE user_id = '" + json.userId + "'";
                                connection.query(sqlQuery, function (err, result) {
                                    if (err == null) {
                                        var userNickname = result[0].user_nickname;
                                        var sqlQuery = "INSERT INTO friend SET ?"
                                        var post = {user_nickname: userNickname, friend_nickname: json.friendNickname};
                                        connection.query(sqlQuery, post, function (err, result) {
                                            if (err == null) {
                                                var sqlQuery = "INSERT INTO friend SET ?"
                                                var post = {user_nickname: json.friendNickname, friend_nickname: userNickname};
                                                connection.query(sqlQuery, post, function (err, result) {
                                                    if (err == null) {
                                                        socket.emit('AddFriendRes', 1);
                                                    } else {
                                                        socket.emit('AddFriendRes', 0); // 특수상황;
                                                    }
                                                });
                                            } else {
                                                socket.emit('AddFriendRes', 0);
                                            }
                                        });

                                    } else {
                                        socket.emit('AddFriendRes', 0);
                                    }
                                });
                            } else {
                                socket.emit('AddFriendRes', 0);
                            }
                        } else {
                            socket.emit('AddFriendRes', 0);
                        }
                    });
                }else {
                    var nameCheck = false;
                    for(var i = 0; i<result.length; i++){
                        var friendName = result[i].friend_nickname;
                        nameCheck = (friendName == json.friend_nickname);
                        if(nameCheck){
                            socket.emit('AddFriendRes', 0);
                        }
                    }
                    if(nameCheck){
                        socket.emit('AddFriendRes', 0);
                    }else {
                        var sqlQuery = "SELECT user_nickname FROM user WHERE user_nickname = '" + json.friendNickname + "'";
                        connection.query(sqlQuery, function (err, result) {
                            if (err == null) {
                                if (result[0] != null) {
                                    var sqlQuery = "SELECT user_nickname FROM user WHERE user_id = '" + json.userId + "'";
                                    connection.query(sqlQuery, function (err, result) {
                                        if (err == null) {
                                            var userNickname = result[0].user_nickname;
                                            var sqlQuery = "INSERT INTO friend SET ?"
                                            var post = {user_nickname: userNickname, friend_nickname: json.friendNickname};
                                            connection.query(sqlQuery, post, function (err, result) {
                                                if (err == null) {
                                                    var sqlQuery = "INSERT INTO friend SET ?"
                                                    var post = {user_nickname: json.friendNickname, friend_nickname: userNickname};
                                                    connection.query(sqlQuery, post, function (err, result) {
                                                        if (err == null) {
                                                            socket.emit('AddFriendRes', 1);
                                                        } else {
                                                            socket.emit('AddFriendRes', 0); // 특수상황;
                                                        }
                                                    });
                                                } else {
                                                    socket.emit('AddFriendRes', 0);
                                                }
                                            });

                                        } else {
                                            socket.emit('AddFriendRes', 0);
                                        }
                                    });
                                } else {
                                    socket.emit('AddFriendRes', 0);
                                }
                            } else {
                                socket.emit('AddFriendRes', 0);
                            }
                        });
                    }
                }
            }else {
                socket.emit('AddFriendRes', 0);
            }
        });



    });

    socket.on('GetFriendList', function (data) {
        var sqlQuery = "SELECT user_nickname FROM user WHERE user_id = '" + data + "'";
        connection.query(sqlQuery, function (err, result) {
            if (err == null) {
                if (result[0] != null) {
                    var sqlQuery = "SELECT friend_nickname FROM friend WHERE user_nickname = '" + result[0].user_nickname + "'";
                    connection.query(sqlQuery, function (err, result) {
                        if (err == null) {
                            if (result != null) {
                                socket.emit('GetFriendListRes', result);
                            }
                        } else {
                            socket.emit('GetFriendListRes', 0);
                        }
                    });
                } else {
                    socket.emit('GetFriendListRes', 0);
                }
            } else {
                socket.emit('GetFriendListRes', 0);
            }
        });

    });

    socket.on('SendMessage', function (data) {
        var json = JSON.parse(data);
        var sqlQuery = "INSERT INTO chat SET ?"
        var post = json;

        connection.query(sqlQuery, post, function (err, result) {
            if (err == null) {
                var json = JSON.parse(data);
                socket.emit('SendMessageRes', data);
                io.sockets.emit(json.friend_nickname+json.user_nickname, data);
            } else {
                socket.emit('SendMessageRes', 0);
            }
        });
    });

    socket.on('GetMessageList', function (data) {
        var json = JSON.parse(data);
        var sqlQuery = "select * from chat where (user_nickname = '" + json.user_nickname + "' AND friend_nickname = '" + json.friend_nickname + "') OR (user_nickname = '" + json.friend_nickname + "' AND friend_nickname = '" + json.user_nickname + "');";
        connection.query(sqlQuery, function (err, result) {
            if (err == null) {
                if (result[0] != null) {
                    socket.emit('GetMessageListRes', result);
                }
            }
        });
    });
});