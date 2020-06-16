var net = require('net');
var server = net.createServer();
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cloud-ba7c0.firebaseio.com"
});

server.listen(5000, '0.0.0.0')

server.on('connection',  (socket) => {
  var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  socket.on('data', function(data){
    const auth = data.toString()
    var db = admin.database()
    db.ref(auth).once('value',function(snap){
      var user = snap.val()
      try{
        if(auth === user.id){
          socket.write(`Login Successful: Welcome ${user.name}\r\n`);
          console.log(`new client connected: ${clientAddress}`);
        }
        else{
          socket.write('Error: Auth failed\r\n');
          socket.destroy()
        }
      }
      catch(err){
        socket.write('Error: Auth failed\r\n');
        socket.destroy()
      }
    })
	})
});

server.on('error', (err) => {
  console.log(`Error occurred in ${clientAddress}: ${err.message}`);
});
