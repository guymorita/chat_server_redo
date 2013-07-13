var rooms = require('./compiled/src/rooms.js'),
fs = require('node-fs'),
sql = require('./../databases/SQL/persistent_server.js'),
url = require('url');


var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var username;

var handleRequest = function(request, response) {
  // get index
  // get setup.js
  // if room
    // if get
    // if post







  // console.log("Serving request type " + request.method + " for url " + request.url);
  var headers = defaultCorsHeaders;
  // sql.checkroom();
  var room = request.url.match(/\/classes\/([\w\d-]+)\/?/);
  var indexURL = request.url.match(/\/\??/);
  console.log('requesturl', request.url);
  // console.log('room', room);
  // console.log('indexurl', indexURL);
  if (room) {
    // console.log('Requested chatroom: ',room[1]);
    headers['Content-Type'] = "application/json";
    response.writeHead(200, headers);
    if (request.method === 'POST') {
      var sentData = '';
      request.on('data', function(data){
        sentData += data;
        // rooms.post(sentData, room[1]);
      });
      response.writeHead(201, headers);
      request.on('end', function(){
        sentData = JSON.parse(sentData);
        // sentData['name'] = username;
        console.log('SENT DATA ----', sentData);
        console.log('sentdatatext', sentData.text);
        sql.newMessage(sentData.text,username);
      });
      response.end();
    } else {
      console.log('matched data url');
      sql.allMessages(function(data){
        headers['Content-Type'] = "application/json";
        console.log('response', response);
        response.writeHead(200, headers);
        console.log('data is', data);
        response.end(JSON.stringify(data));
      });
    }
  } else if (request.url === '/client/js/setup.js') {
    if (request.method === "GET") {
      // console.log('Setup JS file request and sent');
      headers['Content-Type'] = "application/javascript";
      response.writeHead(200, headers);
      var setupJs = fs.readFileSync('./client/js/setup.js');
      response.end(setupJs);
    }
  } else if (indexURL) {
    if (request.method === "GET") {
      // console.log('Index html requested and returned');
      headers['Content-Type'] = "text/html";
      response.writeHead(200, headers);
      var indexHtml = fs.readFileSync('./client/index.html');
      if (url.parse(request.url).query){
        // console.log('url parsed index', url.parse(request.url).query);
        username = (url.parse(request.url).query).match(/username=(\w*)[\/\?#]?/)[1];
        console.log('username', username);
      }
      response.end(indexHtml);

    }
  } else {
    console.log('Invalid URL requested, returned 404');
    headers['Content-Type'] = "text/plain";
    response.writeHead(404, headers);
    response.end('Error: Not Found, Don\'t try that shit again!');
  }
};

exports.handleRequest = handleRequest;
