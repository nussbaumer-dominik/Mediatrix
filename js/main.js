window.onload = function() {

    var socket = new WebSocket('ws://192.168.1.85:10000');

    socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };

    socket.onopen = function(event) {
        socketStatus.innerHTML = 'Connected to: ' + event.currentTarget
            .url;
        socketStatus.className = 'open';
    };

    socket.onmessage = function(event) {
        var message = event.data;
    };

    socket.onclose = function(event) {
        //
    };

    // Daten des Sliders auslesen
    function lightSlider() {
        console.log(this.value + " " + this.id + " " + this.getAttribute(
            "data-id"));
        var data = {
            "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTY5NjA2MDcsImp0aSI6InVuV0NyN21EUHVqQlFvNFZ3R0dpbnU0YzNqOXpCeXltdzg5dHRldk1UbnM9IiwiaXNzIjoiTWVkaWF0cml4IiwibmJmIjoxNTE2OTYwNjA3LCJleHAiOjE1MTY5NjQyMDcsImRhdGEiOnsidXNlck5hbWUiOiIzODI3In19.Qr4OJCGeaEdPG4C8yDODwizZj3B51gwi2lUd802YUFw",
            "dmx": {
                "scheinwerfer": {
                    "id": this.getAttribute("data-id"),
                    "hue": this.value
                }
            }
        };

        socket.send(data);
        console.log(data);
    }

    var lightSliders = document.getElementsByClassName('lightSlider');

    // EventListener zu den Licht Slidern hinzufügen
    for (var i = 0; i < lightSliders.length; i++) {
        lightSliders[i].addEventListener('change', lightSlider, false);
    }


};

//socket.close();
