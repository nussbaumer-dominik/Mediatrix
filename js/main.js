var socket, jwt, ini;
window.onload = function() {

  //Variablen
  var on = false,
      currentConf={};
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
    console.log("message: " + event.data+" "+event.data.ini);
    if(event.data.ini != null){
      console.log("das ist der ini-string: "+event.data);
      ini = event.data;
    }
  };

  //wird ausgegeben, wenn die Verbindung gekappt wurde
  socket.onclose = function(event) {
    console.log("socket closed: " + socket + " " + event.data);
    //localStorage.removeItem("jwt");
  };

  //Daten versenden
  function send(data) {
    //socket.send(JSON.stringify(data));
    console.log(JSON.stringify(data));
  }

  $(".menu-item").each(function() {
    this.addEventListener("click", Beamer);
  });

  $(".menu-open-button").on("click", Beamer)

  $(".mode").each(function() {
    this.addEventListener("click", Buttons);
  });

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
          console.log("ein " + data.beamer.on);
          send(data);
        } else {
          on = false;
          data.beamer.off = 0;
          console.log("aus " + data.beamer.off);
          send(data);
        }
      } else {
        console.log("Beamer - Value: " + $(this).attr("data-value"));
        if ($(this).attr("data-value") == "src") {
          data.beamer.src = 1;
        }
        send(data);
      }
    }
  };

  //Werte der Modes des AV-Receivers auslesen
  function Buttons() {
    if ($(this).attr("data-type") == "av") {
      console.log("Data-type=" + $(this).attr("data-type") + " Value: " + $(
        this).html());
    }
  };

  function setPreset() {

  }

  //Login
  function login(user, pass) {

    var data = new FormData();
        data.append('user', user);
        data.append('passwd', pass);

    $.ajax({
        url:'https://mediatrix.darktech.org/Mediatrix/php/src/Login.php',
        traditional: true,
        method: "POST",
        data: data,
        contentType: false,
        processData: false,
        xhrFields: {
           withCredentials: true
        },
        crossDomain: true
    }).done(function(data){
        console.log("success: "+data);
        jwt = JSON && JSON.parse(data) || $.parseJSON(data);
        localStorage.setItem("jwt", jwt["jwt"]);
        if(jwt != null){
          window.location.href = "dashboard.html";
        }
    }).fail(function(data){
        console.log("error: "+data);
    });
  }


  $('#login').submit(function(ev){
    var username = $("#Benutzername").val(),
        password = $("#Passwort").val();

    //überprüfen, ob alle Felder ausgefüllt sind
    if(username === '' || password === '') {
      ev.preventDefault(); // form submit verhindern
      console.log('Bitte füllen Sie alle Felder aus.');
      alert('Bitte füllen Sie alle Felder aus.');
      return false;
    }else if(username && password){
      login(username, password);
      ev.defaultPrevented;
      //return true; //form submit
    }
  });


  //Ein- Ausblenden
  $(document).ready(function() {

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
          if($("#beamerBox").parents(".flex-container").length == 1 ){
            $("#beamerBox").remove();
          }else{
            $(".flex-container").append($("#beamerTemplate").html());
          }
          break;
        case "2":
          if($("#avBox").parents(".flex-container").length == 1 ){
            $("#avBox").remove();
          }else{
            $(".flex-container").append($("#avTemplate").html());
            initSlider("#avBox");
          }
          break;
        case "3":
          if($("#mikrofonBox").parents(".flex-container").length == 1 ){
            $("#mikrofonBox").remove();
          }else{
            $(".flex-container").append($("#mikroTemplate").html());
            initSlider("#mikrofonBox");
          }
          break;
        case "4":
          if($("#lichtBox").parents(".flex-container").length == 1 ){
            $("#lichtBox").remove();
          }else{
            $(".flex-container").append($("#lichtTemplate").html());
            initSlider("#lichtBox");
          }
          break;
      }

      /*//über die Boxelemente iterieren
      for (var el of $(".box")) {
        //If Box Button matches Box -> show or hide it
        if (this.getAttribute("data-boxbtn") == el.getAttribute("data-box")) {
          el.className = "box visible" == el.className ? "box" : "box visible";
        }
      }*/

      if (this.getAttribute("data-boxbtn") == "5") {
        console.log("Präsentationsmodus einblenden");
        //hide all boxes
        for (var el of $(".box")) {
          el.className = "box";
        }
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
          if ($(".presentation").hasClass("grid")) {
            $(".presentation").removeClass("grid");
          } else {
            $(".presentation").addClass("grid");
            removeChildren(".flex-container");
          }
          break;

        case 1:
          $(".presentation").addClass("grid");
          break;

        case 2:
          $(".presentation").removeClass("grid");
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

    //Slider initialisieren, je nach dem, welche gerade im Markup eingeblendet sind
    function initSlider(container){
      var sliders = $(container).find(".slider");
      var valueFields = $(container).find(".valueField");

      sliders.each(function(slider) {
        console.log(this);
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
  });
}

//socket schließen
//socket.close();
