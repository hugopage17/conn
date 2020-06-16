var net = require('net');
var process = require('process')
var colors = require('colors');

var client = new net.Socket();
client.connect(5000, '35.168.8.55', function(){
  var args = process.argv.slice(2)[0];
  client.write(args)
});

client.on('data', function(data) {
  const msg = data.toString()
	console.log(msg.green)
})

client.on('error', function(data) {
  const msg = data.toString()
	console.log(msg.red)
})
