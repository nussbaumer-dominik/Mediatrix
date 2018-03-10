var socket, jwt;
window.onload = function() {

  //Variablen
  var sliders = document.querySelectorAll(".slider");
  var on = false;
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
      send('{"jwt":"'+jwt+'","ini":1}');
    }
    console.log("socket open: " + socket + " " + event.data);
  };

  //wird bei response des Servers ausgegeben
  socket.onmessage = function(event) {
    console.log("message: " + event.data+" "+event.data.ini);
    if(event.data.ini != null){
      console.log("das ist der ini-string: "+event.data)
    }
  };

  //wird ausgegeben, wenn die Verbindung gekappt wurde
  socket.onclose = function(event) {
    console.log("socket closed: " + socket + " " + event.data);
    localStorage.removeItem("jwt");
  };

  //Daten versenden
  function send(data) {
    //socket.send(data);
    console.log(data);
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
          data.on = 1;
          console.log("ein " + data.on);
          send(data);
        } else {
          on = false;
          data.off = 0;
          console.log("aus " + data.off);
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

  sliders.forEach(function(slider) {
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
    slider.noUiSlider.on('slide', function(values, handle) {
      Slider(this);
      document.getElementsByClassName("valueField")[i].innerHTML =
        values[handle];
    });
  });

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
      ev.preventDefault();
      //return true; //form submit
    }
  });
}

//socket wird geschlossen
//socket.close();
