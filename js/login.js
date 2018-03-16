window.onload = function() {

  var jwt, ini;
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
        url:'/Mediatrix/php/src/Login.php',
        traditional: true,
        method: "POST",
        data: data,
        contentType: false,
        processData: false,
        xhrFields: {
           withCredentials: true
        },
        crossDomain: true,
        error: function(event){
            console.log(event);
        }
    }).done(function(data){
        console.log("success: "+data);
        jwt = JSON && JSON.parse(data) || $.parseJSON(data);
        localStorage.setItem("jwt", jwt["jwt"]);
        if(jwt != null){
          window.location.href = "dashboard.html";
        }
    }).fail(function(data){
        console.log("error");
        console.log(data);
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
      ev.preventDefault();
    }
  });
}

//socket schließen
//socket.close();
