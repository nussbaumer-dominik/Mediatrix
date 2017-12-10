const WebSocket = require('ws');

const socket = new WebSocket.Server({ port: 8080 });

socket.on('connection', function connection(ws) {
  console.log("Client " +  + " verbunden");
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(message+" ist am Server angekommen")
  });
});

socket.onmessage = function(event) {
  console.log(event);
  var message = event.data;
  messagesList.innerHTML += '<li class="received"><span>Received:</span>' + message + '</li>';
};
