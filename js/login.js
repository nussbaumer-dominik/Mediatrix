var socket, jwt, ini;
window.onload = function() {
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
    console.log("message: "+event.data);
    if(event.data[0]= "ini"){
      console.log("das ist der ini-string: "+event.data);
      ini = JSON && JSON.parse(event.data) || $.parseJSON(event.data);
      localStorage.setItem("ini", ini);
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
    }
  });
}

//socket schließen
//socket.close();
