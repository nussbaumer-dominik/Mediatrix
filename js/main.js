var socket;
window.onload = function() {

  //Variablen
  var sliders = document.querySelectorAll(".slider");
  var on = false;
  var jwt;

  //const socket = new WebSocket('wss://192.168.1.85/wss');
  socket = new WebSocket('wss://mediatrix.darktech.org/wss');

  //wirft eine Exception
  socket.onError = function(error) {
    console.log("WebSocket Error: " + error);
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

  //Daten versenden
  function send(data) {
    socket.send(data);
    console.log(data);
  }

  $(".menu-item").each(function(){
    this.addEventListener("click", Beamer);
  });

  $(".menu-open-button").on("click", Beamer)

  $(".mode").each(function(){
    this.addEventListener("click", Buttons);
  });

  //Werte der Slider auslesen
  function Slider(slider) {
    switch (slider.target.getAttribute("data-type")) {
      case "av":
        console.log("Dieser Slider ist von einem AV-Receiver: "+slider.target.getAttribute("data-type"));
        var data = {
          "av": {
            "volume": (slider.get()/100)
          }
        };
        return data;
        break
      case "mixer":
        console.log("Dieser Slider ist von einem Mixer: "+slider.get());
        var data = {
          "mixer": {
            "volume": (slider.get()/100)
          }
        };
        return data;
        break
      case "licht":
        console.log("Dieser Slider ist von einem DMX Gerät: "+"ID: "+ slider.target.getAttribute("data-id") +" "+slider.get());
        var data = {
          "dmx": {
            "scheinwerfer": {
              "id": slider.target.getAttribute("data-id"),
              "hue": slider.get()
            }
          }
        };
        return data;
        break
    }
  };

  //Werte der Beamer Steuerung auslesen
  function Beamer() {
    var data = {
      "beamer": {}
    };
    //Kontrollieren ob vom Typ Beamer
    if($(this).attr("data-type") == "beamer") {
      //Power Knopf erkennen
      if($(this).attr("data-value") == "power") {
        if(!on){
          on = true;
          data.on = 1;
          console.log("ein "+data.on);
        }else {
          on = false;
          data.off = 0;
          console.log("aus "+data.off);
        }
      }else {
        console.log("Beamer - Value: "+$(this).attr("data-value"));
        if($(this).attr("data-value") == "src"){
          data.beamer.src = 1;
        }
        console.log(data);
      }
    }
  };

  //Werte der Modes des AV-Receivers auslesen
  function Buttons() {
    if($(this).attr("data-type") == "av") {
     console.log("Data-type="+$(this).attr("data-type")+" Value: "+$(this).html());
    }
  };

  sliders.forEach(function(slider){
    noUiSlider.create(slider, {
      start: 0,
      format: wNumb({
        decimals: 0
      }),
      connect: [false, false],
      direction: 'rtl',
      orientation: 'vertical',
      range: {
        'min': 0,
        'max': 100
      }
    });
  });

  sliders.forEach(function(slider, i) {
    slider.noUiSlider.on('slide', function(values, handle){
      Slider(this);
      document.getElementsByClassName("valueField")[i].innerHTML = values[handle];
    });
  });

  function setPreset() {

  }
}

//socket wird geschlossen
//socket.close();
