window.onload = function() {

  // Get references to elements on the page.
  var form = document.getElementById('message-form');
  var messageField = document.getElementById('message');
  var messagesList = document.getElementById('messages');
  var socketStatus = document.getElementById('status');
  var closeBtn = document.getElementById('close');
  var socket, sessId = "";
  var alive = true;
  var request = $.ajax({
    url: 'http://10.10.2.1/socket.io/',
    success: function(data) {
      sessId = data.substring(0, 20);
    }
  });

  /*socket = new WebSocket('ws://10.10.2.1/socket.io/1/websocket/' + sessId);*/
  socket = new WebSocket('wss://mediatrix.darktech.org/wss');
  console.log(socket);

  // Handle any errors that occur
  socket.onError = function(error) {
    console.log('WebSocket Error: ' + error);
  };

  // Show a connected message when the WebSocket is opened
  socket.onOpen = function(event) {
    socketStatus.innerHTML = 'Connected to: ' + event.currentTarget
      .url;
    socketStatus.className = 'open';
  };

  // Handle messages sent by the server
  socket.onMessage = function(event) {
    var message = event.data;
    messagesList.innerHTML +=
      '<li class="received"><span>Received: </span>' + message +
      '</li>';
  };

  // Show a disconnected message when the WebSocket is closed
  socket.onClose = function(event) {
    socketStatus.innerHTML = 'Disconnected from WebSocket.';
    socketStatus.className = 'closed';
  };

  // Send a message when the form is submitted
  form.onSubmit = function(e) {
    e.preventDefault();

    // Retrieve the message from the textarea
    var message = messageField.value;

    // Send the message through the WebSocket
    socket.send(message);

    // Add the message to the messages list.
    messagesList.innerHTML +=
      '<li class="sent"><span>Sent: </span>' + message + '</li>';

    // Clear out the message field.
    messageField.value = '';

    return false;
  };

  function keepAlive() {
    socket.send("3:::ALIVE");
    console.log("Alive");
  }

  setTimeout(function() {
    setInterval(function() {
      keepAlive()
    }, 15000)
  }, 3000);



  // Close the WebSocket connection when the close button is clicked
  closeBtn.onclick = function(e) {
    e.preventDefault();

    // Close the WebSocket.
    socket.close();
    alive = false;

    return false;
  };

};

//socket.close();
