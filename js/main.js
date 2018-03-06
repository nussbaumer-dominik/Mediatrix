var socket;
window.onload = function() {
  //sliders + values
  var sliders = document.getElementsByClassName("slider");
  var vals = document.getElementsByClassName("valueField");
  let avSlider1 = document.getElementById('avSlider1');
  let avSlider1Value = document.getElementById('avSlider1Value');
  //Mikrofon
  let mikroSlider1 = document.getElementById('mikroSlider1');
  let mikroSlider2 = document.getElementById('mikroSlider2');
  let mikroMasterSlider = document.getElementById('mikroMasterSlider');
  let mikroSlider1Value = document.getElementById('mikroSlider1Value');
  let mikroSlider2Value = document.getElementById('mikroSlider2Value');
  let mikroMasterSliderValue = document.getElementById('mikroMasterSliderValue');

  //Licht
  let lichtSlider1 = document.getElementById('lichtSlider1');
  let lichtSlider2 = document.getElementById('lichtSlider2');
  let lichtSlider3 = document.getElementById('lichtSlider3');
  let lichtWeissSlider = document.getElementById('lichtWeissSlider');
  let lichtSlider1Value = document.getElementById('lichtSlider1Value');
  let lichtSlider2Value = document.getElementById('lichtSlider2Value');
  let lichtSlider3Value = document.getElementById('lichtSlider3Value');
  let lichtWeissSliderValue = document.getElementById('lichtWeissSliderValue');

  let allItems  = [avSlider1, mikroSlider1, mikroSlider2, mikroMasterSlider, lichtSlider1, lichtSlider2, lichtSlider3, lichtWeissSlider];
  let allValues = [avSlider1Value, mikroSlider1Value, mikroSlider2Value, mikroMasterSliderValue, lichtSlider1Value, lichtSlider2Value, lichtSlider3Value, lichtWeissSliderValue];
  var on = false;

  //const socket = new WebSocket('wss://192.168.1.85/wss');
  socket = new WebSocket('wss://mediatrix.darktech.org/wss');
  console.log(socket);

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
  function Slider() {
    switch (this.target.getAttribute("data-type")) {
      case "av":
        console.log("Dieser Slider ist von einem AV-Receiver: "+this.get());
        var data = {
          "av": {
            "volume": this.get()
          }
        };
        return data;
        break
      case "mixer":
        console.log("Dieser Slider ist von einem Mixer: "+this.get());

        return data;
        break
      case "licht":
        console.log("Dieser Slider ist von einem DMX Gerät: "+this.get());
        var data = {
          "dmx": {
            "scheinwerfer": {
              "id": this.target.getAttribute("data-id"),
              "hue": this.get()
            }
          }
        };
        return data;
        break
    }
  };

  //Werte der Beamer Steuerung auslesen
  function Beamer() {
    var data = {};
    //Kontrollieren ob vom Typ Beamer
    if($(this).attr("data-type") == "beamer") {
      //Power Knopf erkennen
      if($(this).attr("data-value") == "power") {
        if(!on){
          on = true;
          
          console.log("ein")
        }else {
          on = false;
          console.log("aus")
        }
      }else {
        console.log("Data-type="+$(this).attr("data-type")+" Value: "+$(this).attr("data-value"));
      }
    }
  };

  //Werte der Slider auslesen
  function Buttons() {
    if($(this).attr("data-type") == "av") {
     console.log("Data-type="+$(this).attr("data-type")+" Value: "+$(this).html());
    }
  };

  allItems.forEach(function(slider){
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

  /*for(var i=0;i<sliders.length;i++){
    sliders[i].noUiSlider.on('slide', function(values, handle){
      vals[i].innerHTML = values[handle];
    });
  }*/

  /*sliders.forEach(function(slider) {
    slider.noUiSlider.on('update', function(values, handle){
      slider.innerHTML = values[handle];
    });
  });*/



  //AV Slider Value
  avSlider1.noUiSlider.on('update', function(values, handle){
      avSlider1Value.innerHTML = values[handle];
  });
  avSlider1.noUiSlider.on("slide", Slider);

  //Mikrofon Slider Value
  mikroSlider1.noUiSlider.on('update', function(values, handle){
      mikroSlider1Value.innerHTML = values[handle];
  });
  mikroSlider1.noUiSlider.on("slide", Slider);

  mikroSlider2.noUiSlider.on('update', function(values, handle){
      mikroSlider2Value.innerHTML = values[handle];
  });
  mikroSlider2.noUiSlider.on("slide", Slider);

  mikroMasterSlider.noUiSlider.on('update', function(values, handle){
      mikroMasterSliderValue.innerHTML = values[handle];
  });
  mikroMasterSlider.noUiSlider.on("slide", Slider);

  //Licht Slider Value
  lichtSlider1.noUiSlider.on('update', function(values, handle){
      lichtSlider1Value.innerHTML = values[handle];
  });
  lichtSlider1.noUiSlider.on("slide", Slider);

  lichtSlider2.noUiSlider.on('update', function(values, handle){
      lichtSlider2Value.innerHTML = values[handle];
  });
  lichtSlider2.noUiSlider.on("slide", Slider);

  lichtSlider3.noUiSlider.on('update', function(values, handle){
      lichtSlider3Value.innerHTML = values[handle];
  });
  lichtSlider3.noUiSlider.on("slide", Slider);

  lichtWeissSlider.noUiSlider.on('update', function(values, handle){
      lichtWeissSliderValue.innerHTML = values[handle];
  });
  lichtWeissSlider.noUiSlider.on("slide", Slider);


  //Data JSON erstellen
  function build() {
    Slider();
    Buttons();
    Beamer();
    return "";
  }
}

//socket wird geschlossen
//socket.close();
