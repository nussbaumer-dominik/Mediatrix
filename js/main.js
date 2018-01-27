window.onload = function() {

    var socket = new WebSocket('ws://192.168.1.85:10000');

    socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };

    socket.onopen = function(event) {
        console.log("open")
    };

    socket.onclose = function(event) {
        //
    };

    socket.onmessage = function (event){
        console.log(event);
    };

    // Daten des Sliders auslesen und abschicken
    function lightSlider() {
        console.log(this.value + " " + this.id + " " + this.getAttribute(
            "data-id"));
        var data = {
            "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTcwMzk4OTAsImp0aSI6IkRZdW5mNTNuWDY1eWNkV0daRTU3aGFnbUVuc1wvaGRUejVCczdYbDVqdCtnPSIsImlzcyI6Ik1lZGlhdHJpeCIsIm5iZiI6MTUxNzAzOTg5MCwiZXhwIjoxNTE3MDQzNDkwLCJkYXRhIjp7InVzZXJOYW1lIjoiMzgyNyJ9fQ.5F739shj3o75hYtx6U-_1d0LH2iQMC6xJUBtxGU17zk",
            "dmx": {
                "scheinwerfer": {
                    "id": parseInt(this.getAttribute("data-id")),
                    "hue": this.value
                }
            }
        };

        socket.send(JSON.stringify(data));
        console.log(data);
    }

    var lightSliders = document.getElementsByClassName('lightSlider');

    // EventListener zu den Licht Slidern hinzufügen
    for (var i = 0; i < lightSliders.length; i++) {
        lightSliders[i].addEventListener('change', lightSlider, false);
    }


};

//socket.close();
