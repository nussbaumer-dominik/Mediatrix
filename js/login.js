window.onload = function() {
	var jwt;
	//Daten versenden
	function send(data) {
		socket.send(JSON.stringify(data));
		console.log(JSON.stringify(data));
	}

	//Login
	function login(username, password) {
		var data = new FormData();
		data.append("username", username);
		data.append("password", password);

		$.ajax({
			url: "/Mediatrix/php/src/Login.php",
			traditional: true,
			method: "POST",
			data: data,
			contentType: false,
			processData: false,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			complete: function(data) {
				if (jwt != null) {
					window.location.href = "dashboard.html";
				}
			}
		})
			.done(function(data) {
				console.log("success: " + data);
				jwt = (JSON && JSON.parse(data)) || $.parseJSON(data);
				localStorage.setItem("jwt", jwt["jwt"]);
			})
			.fail(function(data) {
				console.log("error: ");
				console.log(data);
				ev.defaultPrevented;
			});
	}

	$("#login").submit(function(ev) {
		var username = $("#Benutzername").val(),
			password = $("#Passwort").val();

		//überprüfen, ob alle Felder ausgefüllt sind
		if (username === "" || password === "") {
			ev.defaultPrevented; // form submit verhindern
			console.log("Bitte füllen Sie alle Felder aus.");
			alert("Bitte füllen Sie alle Felder aus.");
			return false;
		} else if (username && password) {
			login(username, password);
			ev.defaultPrevented;
		}
	});
};

//socket schließen
//socket.close();
