var rooms = require('./compiled/src/rooms.js'),
fs = require('node-fs'),
sql = require('./../databases/SQL/persistent_server.js'),
url = require('url');

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10
};

var username;

var handleRequest = function (req, res){
  var headers = defaultCorsHeaders;
  if (req.method === "GET" && url.parse(req.url).pathname === "/"){
    headers['Content-Type'] = "text/html";
    username = url.parse(req.url).query.split("=")[1];
    res.writeHead(200, headers);
    var indexHtml = fs.readFileSync('./client/index.html');
    res.end(indexHtml);
  } else if (req.method === "GET" && url.parse(req.url).pathname === "/client/js/setup.js"){
    headers["Content-Type"] = "application/javascript";
    res.writeHead(200, headers);
    var setupJs = fs.readFileSync('./client/js/setup.js');
    res.end(setupJs);
  } else if (req.method === "OPTIONS"){
      res.writeHead(200, headers);
      res.end();
  } else if (url.parse(req.url).pathname.split("/")[1] === "classes"){
    headers['Content-Type'] = "application/json";
    roomname = url.parse(req.url).pathname.split("/")[2];
    if (req.method === "GET"){
      res.writeHead(200, headers);
      sql.getMessages(roomname, function(data){
        res.end(JSON.stringify(data));
      });
    } else if (req.method === "POST"){
      res.writeHead(201, headers);
      var sentData = '';
      req.on('data', function(data){
        sentData += data;
      });
      req.on('end', function(){
        sentData = JSON.parse(sentData);
        console.log('sentData = ', sentData);
        sql.newMessage(sentData.text, username, roomname);
      });
      res.end();
    }
  } else {
    headers['Content-Type'] = 'text/plain';
    res.writeHead(404, headers);
    res.end('Error foo');
  }
};

exports.handleRequest = handleRequest;