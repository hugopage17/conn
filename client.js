const socketIo = require("socket.io")
var process = require('process')
var colors = require('colors');

const io = require("socket.io-client"),
    ioClient = io.connect("35.168.8.55:5000");

ioClient.on("seq-num", (msg) => console.info(msg));
