window.onload = function() {

  const socket = new WebSocket('ws://192.168.1.85:10000');

  //wird bei einer Exception geworfen
  socket.onError = function(error) {
    console.log('WebSocket Error: ' + error);
  };

  //wird beim erfolgreichen Öffnen des Sockets ausgegeben
  socket.onOpen = function(event) {
    console.log("socket open: " + socket + " " + event.data);
  };

  //wird bei response des Servers ausgegeben
  socket.onMessage = function(event) {
    const message = event.data;
    console.log("message: " + message);
  };

  //wird ausgegeben, wenn die Verbindung gekappt wurde
  socket.onClose = function(event) {
    console.log("socket closed: " + socket + " " + event.data);
  };

  //senden der Daten
  function send(data) {
    socket.send(data);
    console.log(data);
  }

  //Werte der Slider auslesen
  function Slider() {
    console.log(this.value + " " + this.id + " " + this.getAttribute(
      "data-id"));

    switch (this.getAttribute("data-type")) {
      case "av":
        console.log("Dieser Slider ist von einem AV-Receiver");
        var data = {
          "av": {
            "volume": this.value
          }
        };
        return data;
        break;
      case "mixer":
        console.log("Dieser Slider ist von einem Mixer");

        return data;
        break;
      case "licht":
        console.log("Dieser Slider ist von einem DMX Gerät");
        var data = {
          "dmx": {
            "scheinwerfer": {
              "id": this.getAttribute("data-id"),
              "hue": this.value
            }
          }
        };
        return data;
        break;
    }
  }

  //Alle Slider in eine HTMLCollection schreiben
  const sliders = document.getElementsByClassName('slider');

  // EventListener zu den Slidern hinzufügen
  for (var i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener('change', Slider, false);
  }

  //Data JSON erstellen
  function build() {

  }



  // Daten des Sliders auslesen
  /*function lightSlider() {
      console.log(this.value + " " + this.id + " " + this.getAttribute(
          "data-id"));
      var data = {
          "jwt": "",
          "dmx": {
              "scheinwerfer": {
                  "id": this.getAttribute("data-id"),
                  "hue": this.value
              }
          }
      };

      socket.send(data);
      console.log(data);
  }*/

  /*var lightSliders = document.getElementsByClassName('lightSlider');

  // EventListener zu den Licht Slidern hinzufügen
  for (var i = 0; i < lightSliders.length; i++) {
      lightSliders[i].addEventListener('change', lightSlider, false);
  }*/


};

//socket wird geschlossen
//socket.close();
