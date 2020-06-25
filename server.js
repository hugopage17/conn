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
  var address = socket.request.connection.remoteAddress
  console.log('New connection from ' + address);
  socket.on("disconnect", () => {
    console.log(`${address} has disconnected`)
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`));
