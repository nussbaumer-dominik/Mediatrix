window.onload = function() {

    var socketStatus = document.getElementById('status');

    var socket = new WebSocket('ws://localhost:10000');

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
            "jwt": "ilsdugfilsagufisgf",
            "dmx": {
                "scheinwerfer": {
                    "id": this.getAttribute("data-id"),
                    "hue": this.value
                }
            }
        };

        socket.send(data);
    }

    var lightSliders = document.getElementsByClassName('lightSlider');

    // EventListener zu den Licht Slidern hinzufügen
    for (var i = 0; i < lightSliders.length; i++) {
        lightSliders[i].addEventListener('change', lightSlider, false);
    }


};

/*
$(".slider").change(function() {
    var val = $(this).val();
    var id = $(this).attr("data-id");

    console.log("sending request: " + id + ":" + val);

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
