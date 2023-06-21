
const fs = require('fs');
const mysql = require('mysql-await');
const express = require('express');
const app = express()
const port = process.env.port || 3000;
http = require('http').Server(app),
io = require('socket.io')(http,{
  cors: {
    origin: "*"
  }
}),
app.use(express.static(__dirname + '/public')); 
const cors = require('cors');
app.use(cors())
var axios = require('axios');
var FormData = require('form-data');
const participants = [];

var configDB = {
  "connectionLimit" : 10,
  "host"            : "93.104.210.236",
  "port"            : "3306",
  "user"            : "macbereg_gdadmin",
  "password"        : "AA0wDs_njZO_",
  "database"        : "macbereg_gd"
  // "connectionLimit" : 10,
  // "host"            : "78.141.219.177",
  // "port"            : "3306",
  // "user"            : "golden_deal_admin",
  // "password"        : "_t3Y9zo93",
  // "database"        : "golden_deal_db"

};

const connection = mysql.createConnection(configDB);

io.on('connection', function(socket) {
  var client = {};
  // console.log("new user is connected ");

  //Golden Deal chat
  socket.on('user_connected' ,function (data){
    (async () => {
        console.log(data)
        console.log('a user connected ' + data.userid + " Hash " + JSON.stringify(socket.handshake.query));
        participants[data.userid] = socket.id;
        //io.emit('load_conversation_list', data);
    })();
  });
  socket.on('send_message' ,function (data){
    (async () => {
      var receiversocketId = participants[data.sender];
      var socketId = participants[data.receiver];
      var send_recev_sum = (data.sender + data.receiver);
      var chat_code = 'chat-'+send_recev_sum+'-'+(data.sender * data.receiver)+'-'+(send_recev_sum * 2)+'-code';
      var result = await connection.awaitQuery(`INSERT INTO messages (chat_code, sender, receiver, message) VALUES (? ,?, ?, ?)`, [chat_code, data.sender, data.receiver, data.message]);
      var msg = await connection.awaitQuery(`SELECT * FROM messages WHERE id = ?`, [result.insertId]);
      io.to(receiversocketId).emit("new_message", {"sender": msg[0].sender, "receiver": msg[0].receiver, "message": msg[0].message, "created_at": msg[0].created_at });
      io.to(socketId).emit("new_message", {"sender": msg[0].sender, "receiver": msg[0].receiver, "message": msg[0].message, "created_at": msg[0].created_at });
    })();
    // console.log("new msg sent");
  });

});

app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/public/index.html');
  res.send(`<h1>hello socket.io</h1>`)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/get_conversation_list", async function (req, res) {
  var response = [];
  var messages = await connection.awaitQuery(`SELECT t1.* FROM messages t1 JOIN (SELECT chat_code, MAX(id) id FROM messages WHERE sender = ? OR receiver = ? GROUP BY chat_code) t2 ON t1.id = t2.id AND t1.chat_code = t2.chat_code ORDER BY id DESC`, [req.body.sender,req.body.sender,req.body.sender]);
  res.json(messages);
});

app.post("/get_messages", async function (req, res) {  
  var messages = await connection.awaitQuery("SELECT `sender` AS sender_id,(SELECT `name` FROM `users` WHERE `id` = `messages`.`sender`) AS sender_name, (SELECT `image` FROM `users` WHERE id = `messages`.`sender`) AS sender_avatar, `receiver` AS receiver_id ,(SELECT `name` FROM `users` WHERE `id` = `messages`.`receiver`) AS receiver_name, (SELECT `image` FROM `users` WHERE `id` = `messages`.`receiver`) AS receiver_avatar, `message`, `seen_at`, `created_at` FROM `messages` WHERE (`sender` = ? AND `receiver` = ?) OR (`sender` = ? AND `receiver` = ?) ORDER BY `created_at` ASC", [req.body.sender, req.body.receiver, req.body.receiver, req.body.sender]);
  res.json(messages);
});

var serverport = process.env.PORT || 3000;
http.listen( serverport , function() {
  console.log('Express app listening at ' + serverport);
});