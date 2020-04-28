'use strict';

const http = require('http');

const node_static = require('node-static');



const static_directory = new node_static.Server(__dirname + '/dist');
debugger
// 3. Usual http stuff
const server = http.createServer();
server.addListener('request', function(req, res) {
  static_directory.serve(req, res);
});
server.addListener('upgrade', function(req, res) {
  res.end();
});



console.log(' [*] Listening on 0.0.0.0:8080');
server.listen(8080, '0.0.0.0');