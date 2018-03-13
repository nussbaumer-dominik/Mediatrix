var socket, jwt, ini;
window.onload = function() {

  //Variablen
  var on = false,
      currentConf = {
        "jwt": "",
        "name": "",
        "conf": {}
      },
      conf = {
        "av": {},
        "dmx": {},
        "mixer": {},
        "beamer": {}
      };
  jwt = localStorage.getItem("jwt");

  //const socket = new WebSocket('wss://192.168.1.85/wss');
  socket = new WebSocket("wss://mediatrix.darktech.org/wss");
  //socket = new WebSocket("wss://193.154.93.223/wss");

  //wirft eine Exception
  socket.onerror = function(error) {
    console.log("WebSocket Error: " + error);
  };

  //wird beim erfolgreichen Öffnen des Sockets ausgegeben
  socket.onopen = function(event) {
    if(jwt != null){
      socket.send('{"jwt":"'+jwt+'","ini":1}');
    }
    console.log("socket open: " + socket + " " + event.data);
  };

  //wird bei Response des Servers ausgegeben
  socket.onmessage = function(event) {
    if(JSON.parse(event.data)["ini"]){
      console.log("das ist der ini-string: "+event.data);
      ini = JSON && JSON.parse(event.data) || $.parseJSON(event.data);
    }else{
      console.log("message: "+event.data);
    }
  };

  //wird ausgegeben, wenn die Verbindung gekappt wurde
  socket.onclose = function(event) {
    console.log("socket closed: " + socket + " " + event.data);
  };

  //Daten versenden
  function send(data) {
    socket.send(JSON.stringify(data));
    console.log(JSON.stringify(data));
  }

  //Werte der Slider auslesen
  function Slider(slider) {
    switch (slider.target.getAttribute("data-type")) {
      case "av":
        console.log("Dieser Slider ist von einem AV-Receiver: " + slider.target
          .getAttribute("data-type"));
        var data = {
          "jwt": jwt,
          "av": {
            "volume": (slider.get() / 100),
            "channel": slider.target.getAttribute("data-id")
          }
        };
        conf.av = {
          "volume": (slider.get() / 100),
          "channel": slider.target.getAttribute("data-id")
        };
        send(data);
        return data;
        break
      case "mixer":
        console.log("Dieser Slider ist von einem Mixer: " + slider.get());
        var data = {
          "jwt": jwt,
          "mixer": {
            "volume": (slider.get() / 100),
            "channel": slider.target.getAttribute("data-id")
          }
        };
        conf.mixer = {
          "volume": (slider.get() / 100),
          "channel": slider.target.getAttribute("data-id")
        };
        send(data);
        return data;
        break
      case "licht":
        console.log("Dieser Slider ist von einem DMX Gerät: " + "ID: " +
          slider.target.getAttribute("data-id") + " " + slider.get());
        var data = {
          "jwt": jwt,
          "dmx": {
            "scheinwerfer": {
              "id": slider.target.getAttribute("data-id"),
              "hue": slider.get()
            }
          }
        };
        conf.dmx = {
          "scheinwerfer": {
            "id": slider.target.getAttribute("data-id"),
            "hue": slider.get()
          }
        };
        send(data);
        return data;
        break
    }
  };

  //Werte der Beamer Steuerung auslesen
  function Beamer() {
    var data = {
      "jwt": jwt,
      "beamer": {}
    };
    //Kontrollieren ob vom Typ Beamer
    if ($(this).attr("data-type") == "beamer") {
      //Power Knopf erkennen
      if ($(this).attr("data-value") == "power") {
        if (!on) {
          on = true;
          data.beamer.on = 1;
          conf.beamer.on = 1;
          console.log("ein " + data.beamer.on);
          send(data);
        } else {
          on = false;
          data.beamer.off = 0;
          conf.beamer.off = 0;
          console.log("aus " + data.beamer.off);
          send(data);
        }
      } else {
        console.log("Beamer - Value: " + $(this).attr("data-value"));
        if ($(this).attr("data-value") == "src") {
          data.beamer.source = 1;
          conf.beamer.source = 1;
        }else if($(this).attr("data-value") == "freeze"){
          data.beamer.freeze = 1;
          conf.beamer.freeze = 1;
        }else if($(this).attr("data-value") == "blackout"){
          data.beamer.blackout = 1;
          conf.beamer.blackout = 1;
        }
        send(data);
      }
    }
  };

  //Werte der Modes des AV-Receivers auslesen
  function Buttons() {
    if ($(this).attr("data-type") == "av") {
      console.log("Data-type=" + $(this).attr("data-type") + " Value: " + $(this).html());
    }
  };

  function selectAvConf(){
    console.log("selectAvConf");
    for(let i=0;i<Object.keys(ini.ini.av.presets).length;i++){
      console.log("drinnen "+ini.ini.av.presets[i]);
      $(document.createElement('li')).addClass("mode")
          .attr("data-type", "av")
          .html(ini.ini.av.presets[i])
          .appendTo($("#avModes"));
    }
  }

  function selectLichtConf(){
    console.log("selectLichtConf");
    console.log(Object.keys(ini.ini.dmx).length);

    for(let i=0;i<Object.keys(ini.ini.dmx).length;i++){
      var scheinwerfer = ini.ini.dmx["scheinwerfer"+i];
      if(scheinwerfer.numberChannels == "4"){
        var t = document.querySelector('#rgbwTemplate').innerHTML;
        for(let j=0;j<parseInt(scheinwerfer.numberChannels);j++){
          t = t.replace(/{:id}/, scheinwerfer.id);
        }
        $(".flex-container").append(t);
      }else if(scheinwerfer.numberChannels == "1"){
        var t = document.querySelector('#hueTemplate').innerHTML;
        for(let j=0;j<parseInt(scheinwerfer.numberChannels);j++){
          t = t.replace(/{:id}/, scheinwerfer.id);
        }
        $(".flex-container").append(t);
      }
    }
    return true;
  }

  function selectMixerConf(){
    console.log("selectMixerConf "+ ini);
  }

  function setPreset() {
    console.log("Preset '"+ $("#presetName").val() +"' speichern");
    var name = $("#presetName").val();
    currentConf["jwt"] = jwt;
    currentConf["name"] = name;
    currentConf["conf"] = conf;
    send(conf);
  }

  function getPresets(container){

  }

  $("#savePreset").on("click", setPreset);

  //Ein- Ausblenden
  var isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent
    .match(/Mobi/));

  //EventListener den Box Buttons hinzufügen
  $(".boxButtons").on("click", function() {
    toggleFlexContainer(1);
    togglePresMode(2);
    toggleStatus(1);

    if (isMobile) {
      toggleMobileOptions(1);
    }

    switch($(this).attr("data-boxbtn")){
      case "1":
        if($("#beamerBox").parents(".flex-container").length == 1){
          $("#beamerBox").remove();
        }else{
          $(".flex-container").append($("#beamerTemplate").html());
          $(".menu-item").each(function() {
            $(this).on("click", Beamer);
          });
          $(".menu-open-button").on("click", Beamer);
        }
        break;
      case "2":
        if($("#avBox").parents(".flex-container").length == 1){
          $("#avBox").remove();
        }else{
          selectAvConf();
          $(".flex-container").append($("#avTemplate").html());
          initSlider("#avBox");
          $(".mode").each(function() {
            this.addEventListener("click", Buttons);
          });
        }
        break;
      case "3":
        if($("#mikrofonBox").parents(".flex-container").length == 1){
          $("#mikrofonBox").remove();
        }else{
          selectMixerConf();
          $(".flex-container").append($("#mikroTemplate").html());
          initSlider("#mikrofonBox");
        }
        break;
      case "4":
        if($(".lichtBox").parents(".flex-container").length == 1){
          $(".lichtBox").remove();
        }else{
          if(selectLichtConf()){
            console.log("SelectLichtConf ist fertig");
            initSlider(".lichtBox");
          }
        }
        break;
    }

    if (this.getAttribute("data-boxbtn") == "5") {
      console.log("Präsentationsmodus einblenden");
      //hide all boxes
      removeChildren(".flex-container");
      toggleFlexContainer(0);
      togglePresMode(0);
      toggleStatus(0);
      if (isMobile) {
        toggleMobileOptions(0);
      }
    }
  });

  function togglePresMode(count) {
    switch (count) {
      case 0:
        if ($(".presentation").hasClass("flex")) {
          $(".presentation").removeClass("flex");
        } else {
          $(".presentation").addClass("flex");
          removeChildren(".flex-container");
          getPresets(".presentation");
        }
        break;
      case 1:
        $(".presentation").addClass("flex");
        getPresets(".presentation");
        break;
      case 2:
        $(".presentation").removeClass("flex");
        break;
    }
  }

  function toggleFlexContainer(count) {
    switch (count) {
      case 0:
        if ($(".flex-container").hasClass("flex")) {
          $(".flex-container").removeClass("flex");
        } else {
          $(".flex-container").addClass("flex");
        }
        break;

      case 1:
        $(".flex-container").addClass("flex");
    }
  }

  function toggleStatus(count) {
    switch (count) {
      case 0:
        if ($(".statusBox").hasClass("toggleStatus")) {
          $(".statusBox").removeClass("toggleStatus");
        } else {
          $(".statusBox").addClass("toggleStatus");
        }
        break;

      case 1:
        $(".statusBox").addClass("toggleStatus");
    }
  }

  function toggleMobileOptions(count) {
    switch (count) {
      case 0:
        if ($(".mobileOptions").hasClass("toggleMobileOptions")) {
          $(".mobileOptions").removeClass("toggleMobileOptions");
        } else {
          $(".mobileOptions").addClass("toggleMobileOptions");
        }
        break;

      case 1:
        $(".mobileOptions").addClass("toggleMobileOptions");
    }
  }

  function removeChildren(container){
    $(container).empty();
  }

  function initDMX(){

  }

  //Slider initialisieren, je nach dem, welche gerade im Markup eingeblendet sind
  function initSlider(container){
    var sliders = $(container).find(".slider");
    var valueFields = $(container).find(".valueField");

    sliders.each(function(slider) {
      noUiSlider.create(this, {
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

    sliders.each(function(i, slider) {
      this.noUiSlider.on('slide', function(values, handle) {
        Slider(this);
        valueFields.get(i).innerHTML = values[handle];
      });
    });
  }
}

//socket schließen
//socket.close();
