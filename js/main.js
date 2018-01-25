window.onload = function() {

    // Get references to elements on the page.
    var socketStatus = document.getElementById('status');


    // Create a new WebSocket.
    var socket = new WebSocket(
        'ws://localhost:10000');


    // Handle any errors that occur.
    socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };


    // Show a connected message when the WebSocket is opened.
    socket.onopen = function(event) {
        socketStatus.innerHTML = 'Connected to: ' + event.currentTarget
            .url;
        socketStatus.className = 'open';
    };


    // Handle messages sent by the server.
    socket.onmessage = function(event) {
        var message = event.data;
        messagesList.innerHTML +=
            '<li class="received"><span>Received: </span>' + message +
            '</li>';
    };


    // Show a disconnected message when the WebSocket is closed.
    socket.onclose = function(event) {
        socketStatus.innerHTML = 'Disconnected from WebSocket.';
        socketStatus.className = 'closed';
    };


    // Send a message when the form is submitted.
    form.onsubmit = function(e) {
        e.preventDefault();

        // Retrieve the message from the textarea.
        var message = messageField.value;

        // Send the message through the WebSocket.
        socket.send(message);

        // Add the message to the messages list.
        messagesList.innerHTML +=
            '<li class="sent"><span>Sent: </span>' + message + '</li>';

        // Clear out the message field.
        messageField.value = '';

        return false;
    };

};


$(".slider").change(function() {
    var val = $(this).val();
    var id = $(this).attr("data-id");

    console.log("sending request: " + id + ":" + val); * /

    $.ajax({
        url: "php/send.php",
        data: {
            "channel": id,
            "value": val
        },
        success: function(result) {
            console.log("success");
        },
        error: function(result) {
            console.log("error");
        }
    });
})

//socket.close();
