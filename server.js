const express = require("express");
const http = require("http");
const socketIo = require("socket.io")
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cloud-ba7c0.firebaseio.com"
});

const port = process.env.PORT || 5000;

const app = express();
app.use(function (req, res, next) {
  res.send('Hello World')
})
const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  var db = admin.database()
  let auth
  let userData
  socket.on('data', (data) => {
    auth = data.toString()
    db.ref(auth).once('value',function(snap){
      var user = snap.val()
      userData = user
      try{
        if(auth === user.id){
          console.log(`${user.name} is online - id: ${user.id}`)
          db.ref(`${auth}/status`).set({online:true})
        }
        else{
          socket.disconnect()
        }
      }
      catch(err){
        socket.disconnect()
      }
    })
  })
  socket.on("disconnect", () => {
    console.log(`${userData.name} has disconnected - id: ${userData.id}`)
    db.ref(`${auth}/status`).set({online:false})
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`));
