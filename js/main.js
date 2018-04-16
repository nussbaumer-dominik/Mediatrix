$(function () {
	let ini,
		sessId,
		presetStart = 0,
		presets,
		jwt = localStorage.getItem("jwt"),
		on = false,
		isMobile = "ontouchstart" in document.documentElement && navigator.userAgent.match(/Mobi/),
		currentConf = {
			name: "",
			conf: {}
		},
		conf = {
			av: {},
			dmx: {},
			mixer: {
				mikrofone: [{
					id: "0",
					value: 0
				}, {
					id: "1",
					value: 0
				}]
			},
			beamer: {}
		};

	let mixerData = {
		mixer: {
			mikrofone: [{
				id: "0",
				value: 0
			}, {
				id: "1",
				value: 0
			}]
		}
	};
	let scheinwerfer = {};
	//let socket = new WebSocket("wss://192.168.1.235/wss");
	let socket = new WebSocket("wss://10.0.0.144/wss");

	//wirft eine Exception
	socket.onerror = error => {
		console.log("WebSocket Error: " + error);
	};

	//wird beim erfolgreichen Öffnen des Sockets ausgegeben
	socket.onopen = event => {
		if (jwt != null) {
			socket.send('{"jwt":"' + jwt + '","ini":1}');
		}
		console.log("socket wurde geöffnet");
	};

	//wird bei Response des Servers ausgelöst
	socket.onmessage = event => {
		console.log("Message: ");
		let message = JSON.parse(event.data);
		let userspans = $(".groupWrapper");
		console.log(userspans);
		console.log(userspans.length);
		console.log(message);

		/*if(message.live.slots){
			$("#slots").val(message.live.slots);
		}*/

		if (message.group) {
			if (message.group.admin == false) {
				$("#slots").prop('disabled', true);
			}

			if (message["group"]["register"]) {
				$(".modal-wrapperGroup").toggleClass("open");
				$("#groupModal").toggleClass("open");
				$("#acceptUser").click(ev => {
					ev.preventDefault();
					send(message);
					$(".modal-wrapperGroup").toggleClass("open");
					$("#groupModal").toggleClass("open");
					$(".groupWrapper").append("<span></span>");
				});
				$("#dontAcceptUser").click(ev => {
					ev.preventDefault();
					$(".modal-wrapperGroup").toggleClass("open");
					$("#groupModal").toggleClass("open");
				});
			}
		}

		if(message.live.group){
			console.log("Anzahl an Spans:" + userspans.length + " Anzahl an usern in der Gruppe: " + Object.keys(message.live.group).length);
			if (userspans.length < Object.keys(message.live.group).length) {
				$(".groupWrapper").append("<span></span>");
			} else if (userspans.length > Object.keys(message.live.group).length) {
				$(".groupWrapper span:last").remove();
			}
		}
		
		if (message.ini) {
			console.log("das ist der ini-string: " + event.data);
			ini = (JSON && JSON.parse(event.data)) || $.parseJSON(event.data);
			presets = ini.ini.presets;
			$(".lenz").prepend('<input type="number" min="1" max="3" value="' + ini.live.slots + '" id="slots">');
			console.log(presets);
			firstLiveStatus();
			getPresets();
			toggleBase();
			on = (ini.live.beamer.on === true) ? true : false;
			if (on) {
				$("#power").prop("checked", true);
				$("#beamerState").attr("data-state", "1");
			}
			return true;
		} else {
				updateLive(message.live);
				liveStatus(message.live);
		}
	} 

	//wird getriggered, wenn die Verbindung gekappt wurde
	socket.onclose = event => {
		console.log("socket closed: " + socket + " " + event);
		outputMessage("Die Verbindung mit dem Server wurde geschlossen");
	};

	//Daten versenden
	var send = data => {
		try {
			data.jwt = jwt;
			socket.send(JSON.stringify(data));
			console.log("Daten wurden gesendet ");
			console.log(JSON.stringify(data));
		} catch (data) {
			outputMessage(data);
		}
	};

	//Werte der Slider auslesen
	function Slider(slider) {
		switch (slider.target.getAttribute("data-type")) {
			case "av":
				console.log(
					"Dieser Slider ist von einem AV-Receiver: " +
					slider.target.getAttribute("data-type")
				);
				let avdata = {
					av: {
						volume: slider.get()
					}
				};
				conf.av = {
					volume: slider.get()
				};
				send(avdata);
				break;
			case "mixer":
				let id = slider.target.getAttribute("data-id");
				let val = slider.get() / 100;
				if (!isNaN(id)) {
					console.log(
						"Dieser Slider ist von einem Mixer: " + slider.get()
					);

					if (id === "0") {
						mixerData.mixer.mikrofone[0].value = val;
						conf.mixer.mikrofone[0].value = val;
					} else if (id === "1") {
						mixerData.mixer.mikrofone[1].value = val;
						conf.mixer.mikrofone[1].value = val;
					}

					send(mixerData);
				} else if (id == "m") {
					mixerData.mixer.master = val;
					conf.mixer.master = val;
					send(mixerData);
				} else if (id == "l") {
					mixerData.mixer.line = val;
					conf.mixer.line = val;
					send(mixerData);
				}
				break;
			case "dmx":
				console.log(
					"Dieser Slider ist von einem DMX Gerät: " +
					"Id: " +
					slider.target.getAttribute("data-id") +
					" " +
					slider.get()
				);
				console.log(slider.target.getAttribute("data-col"));
				scheinwerfer[slider.target.getAttribute("data-id")][slider.target.getAttribute("data-col")] = parseInt(slider.get());

				let obj = {
					id: slider.target.getAttribute("data-id")
				};
				for (farbe in scheinwerfer[
						slider.target.getAttribute("data-id")
					]) {
					obj[farbe] =
						scheinwerfer[slider.target.getAttribute("data-id")][
							farbe
						];
				}
				let sendObj = {
					dmx: {}
				};
				sendObj.dmx[
					"scheinwerfer" + slider.target.getAttribute("data-id")
				] = obj;
				conf.dmx[
					"scheinwerfer" + slider.target.getAttribute("data-id")
				] = obj;

				console.log(conf.dmx);
				console.log(sendObj);
				send(sendObj);
				break;
		}
	}

	function muteButton() {
		let $this = $(this);
		let id = $this.attr("data-id");
		console.log(id);

		if ($this.attr("data-type") == "mixer") {
			if ($this.attr("data-state") == "0") {
				$this.attr("data-state", "1");
				console.log(mixerData.mixer.mikrofone);
				if (id === "0") {
					console.log(mixerData.mixer.mikrofone);
					mixerData.mixer.mikrofone[0].mute = 1;
					conf.mixer.mikrofone[0].mute = 1;
					$this.find("i").removeClass("fa-volume-up");
					$this.find("i").addClass("fa-volume-off");
				} else if (id === "1") {
					mixerData.mixer.mikrofone[1].mute = 1;
					conf.mixer.mikrofone[1].mute = 1;
					$this.find("i").removeClass("fa-volume-up");
					$this.find("i").addClass("fa-volume-off");
				}
				outputMessage("Das Mikrofon wurde stumm geschalten.");
			} else {
				$this.attr("data-state", "0");

				if (id === "0") {
					mixerData.mixer.mikrofone[0].mute = 0;
					conf.mixer.mikrofone[0].mute = 0;
					$this.find("i").removeClass("fa-volume-off");
					$this.find("i").addClass("fa-volume-up");
				} else if (id === "1") {
					mixerData.mixer.mikrofone[1].mute = 0;
					conf.mixer.mikrofone[1].mute = 0;
					$this.find("i").removeClass("fa-volume-off");
					$this.find("i").addClass("fa-volume-up");
				}
				outputMessage("Das Mikrofon wurde freigegeben.");
			}
		}
		send(mixerData);
	}

	//Werte der Beamer Steuerung auslesen
	function Beamer() {
		let data = {
			beamer: {}
		};
		let $this = $(this);
		if ($this.attr("data-type") == "beamer") {
			if ($this.attr("data-value") == "power") {
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
				console.log("Beamer - Value: " + $this.attr("data-value"));
				if ($this.attr("data-value") == "src") {
					data.beamer.source = 1;
					conf.beamer.source = 1;
				} else if ($this.attr("data-value") == "freeze") {
					data.beamer.freeze = 1;
					conf.beamer.freeze = 1;
				} else if ($this.attr("data-value") == "blackout") {
					data.beamer.blackout = 1;
					conf.beamer.blackout = 1;
				}
				send(data);
			}
		}
	}

	//Werte der Modi des AV-Receivers auslesen
	function Buttons() {
		let $this = $(this);
		let avdata = {
			av: {}
		};
		if ($this.attr("data-type") == "av") {
			console.log(
				"Data-type=" +
				$this.attr("data-type") +
				" Value: " +
				$this.html()
			);
			avdata.av.mode = $this.html();
			conf.av.mode = $this.html();
			console.log(avdata);
		}
		send(avdata);
	}

	function selectAvConf() {
		console.log("selectAvConf");
		$(".flex-container").append($("#avTemplate").html());
		for (let i = 0; i < Object.keys(ini.ini.av.presets).length; i++) {
			$("<li/>", {
				text: "" + ini.ini.av.presets[i],
				class: "mode",
				"data-type": "av",
				appendTo: "#avModes"
			});
		}
		let slider = document.querySelector("#avSlider1");
		noUiSlider.create(slider, {
			start: 0,
			format: wNumb({
				decimals: 0
			}),
			connect: [false, false],
			direction: "rtl",
			orientation: "vertical",
			range: {
				min: parseInt(ini.ini.av.minVolume),
				max: parseInt(ini.ini.av.maxVolume)
			}
		});
		slider.noUiSlider.on("change", function (values, handle) {
			Slider(this);
		});
		slider.noUiSlider.on("slide", function (values, handle) {
			document.getElementById("avSlider1Value").innerHTML =
				values[handle];
		});
		updateAvSlider();
	}

	function selectLichtConf() {
		console.log("selectLichtConf");
		for (let i = 0; i < Object.keys(ini.ini.dmx).length; i++) {
			var scheinwerferObj = ini.ini.dmx["scheinwerfer" + i];
			console.log(scheinwerfer);
			if (scheinwerferObj.numberChannels == "4") {
				scheinwerfer[scheinwerferObj.id] = { r: 0, g: 0, b: 0, w: 0 };

				var t = document.querySelector("#rgbwTemplate").innerHTML;

				for ( let j = 0; j < 2*parseInt(scheinwerferObj.numberChannels); j++ ) {
					t = t.replace(/{:id}/, scheinwerferObj.id);
					t = t.replace(/{{:sliderId}}/, "Scheinwerfer" + scheinwerferObj.id);
				}

				t = t.replace( /{:lightNumber}/, scheinwerferObj.id + 1 );
				t = t.replace( /{{:id}}/, "Scheinwerfer" + (scheinwerferObj.id + 1) );
				$(".flex-container").append(t);
			} else if (scheinwerferObj.numberChannels == "5") {
				scheinwerfer[scheinwerferObj.id] = { r: 0, g: 0, b: 0, w: 0, hue: 0 };

				var t = document.querySelector("#rgbwhTemplate").innerHTML;

				for (let j = 0; j < 2 * parseInt(scheinwerferObj.numberChannels); j++) {
					t = t.replace(/{:id}/, scheinwerferObj.id);
					t = t.replace(/{{:sliderId}}/, "Scheinwerfer" + scheinwerferObj.id);
				}

				t = t.replace(/{:lightNumber}/, scheinwerferObj.id + 1);
				t = t.replace(/{{:id}}/, "Scheinwerfer" + (scheinwerferObj.id + 1));
				$(".flex-container").append(t);
			} else if (scheinwerferObj.numberChannels == "1") {
				scheinwerfer[scheinwerferObj.id] = { hue: 0 };

				var t = document.querySelector("#hueTemplate").innerHTML;
				for ( let j = 0; j < 2*parseInt(scheinwerferObj.numberChannels); j++ ) {
					t = t.replace(/{:id}/, scheinwerferObj.id);
					t = t.replace(/{{:sliderId}}/, "Scheinwerfer" + scheinwerferObj.id);
				}

				t = t.replace(/{:lightNumber}/, scheinwerferObj.id + 1);
				$(".flex-container").append(t);
			} else if (scheinwerferObj.numberChannels == "3") {
				scheinwerfer[scheinwerferObj.id] = { r: 0, g: 0, b: 0 };

				var t = document.querySelector("#rgbTemplate").innerHTML;

				for ( let j = 0; j < 2*parseInt(scheinwerferObj.numberChannels); j++ ) {
					t = t.replace(/{:id}/, scheinwerferObj.id);
					t = t.replace(/{{:sliderId}}/, "Scheinwerfer" + scheinwerferObj.id);
				}

				t = t.replace(/{:lightNumber}/, scheinwerferObj.id + 1);
				$(".flex-container").append(t);
			}
		}

		var sliders = $(".lichtBox").find(".lichtSlider");
		var valueFields = $(".lichtBox").find(".lichtValue");

		sliders.each(function (slider) {
			noUiSlider.create(this, {
				start: 0,
				format: wNumb({
					decimals: 0
				}),
				connect: [false, false],
				direction: "rtl",
				orientation: "vertical",
				range: {
					min: 0,
					max: 255
				}
			});
		});

		sliders.each(function (i, slider) {
			this.noUiSlider.on("change", function (values, handle) {
				Slider(this);
			});
			this.noUiSlider.on("slide", function (values, handle) {
				valueFields.get(i).innerHTML = values[handle];
			});
		});
	}

	$("#savePreset").on("click", ev => {
		ev.preventDefault();
		console.log("Preset '" + $("#presetName").val() + "' speichern");
		let name = $("#presetName").val();
		currentConf.name = name;
		currentConf.conf = conf;

		let preset = new FormData();
		preset.append("jwt", jwt);
		preset.append("name", name);
		preset.append("conf", JSON.stringify(conf));
		console.log(preset);

		$.ajax({
				url: "/Mediatrix/php/src/savePreset.php",
				traditional: true,
				method: "POST",
				data: preset,
				contentType: false,
				processData: false,
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				complete: () => {}
			})
			.done(data => {
				console.log("success: " + data);
				addPreset(currentConf);
				presets.push(currentConf);
				outputMessage("Das Preset " + $("#presetName").val() + " wurde erstellt");
			})
			.fail(data => {
				console.log("error: ");
				console.log(data);
				outputMessage("Das Preset " + $("#presetName").val() + " konnte nicht erstellt werden");
			});
	});

	function addPreset(data) {
		console.log(data);
		var div = $("<div/>", {
			class: "preset"
		}).attr("data-preset", presetStart);
		div.append("<h2>" + data.name + "</h2>");
		if (typeof data.conf.dmx.length !== "undefined") {
			div.append(
				"<div> <i class='fas fa-lightbulb'> </i> <h3>" +
				Object.keys(data.conf.dmx).length +
				"</h3> </div>"
			);
		} else  {
			div.append(
				"<div> <i class='fas fa-lightbulb'> </i> <h3>0</h3> </div>"
			);
		}
		if (typeof data.conf.av.mode !== "undefined") {
			div.append(
				"<div> <i class='fas fa-volume-up'> </i> <h3>" +
				data.conf.av.mode +
				"</h3> </div>"
			);
		} else {
			div.append(
				"<div> <i class='fas fa-volume-up'> </i> <h3> - </h3> </div>"
			);
		}
		if (typeof data.conf.beamer.on !== "undefined") {
			if (data.conf.beamer.on) {
				div.append(
					"<div> <i class='fas fa-video'> </i> <h3>ein</h3> </div>"
				);
			} else {
				div.append(
					"<div> <i class='fas fa-video'> </i> <h3>aus</h3> </div>"
				);
			}
		} else {
			div.append("<div> <i class='fas fa-video'> </i> <h3>aus</h3> </div>");
		}
		if (typeof data.conf.mixer.mikrofone !== "undefined") {
			div.append(
				"<div> <i class='fas fa-microphone'> </i> <h3>" +
				Object.keys(data.conf.mixer.mikrofone) +
				"</h3> </div>"
			);
		} else  {
			div.append(
				"<div> <i class='fas fa-microphone'> </i> <h3>0</h3> </div>"
			);
		}
		$(".presentation").append(div);
		presetStart++;
		console.log("getPresets: " + presetStart);
		$(".preset").on("click", selectPreset);
	}

	function getPresets() {
		for (let i = presetStart; i < Object.keys(presets).length; i++) {
			console.log(presets[i].name + " conf:");
			console.log(presets[i].conf);

			var div = $("<div/>", {
				class: "preset"
			}).attr("data-preset", i);
			console.log(presets[i].conf);
			div.append("<h2>" + presets[i].name + "</h2>");
			if (typeof presets[i].conf.dmx.length !== "undefined") {
				div.append(
					"<div> <i class='fas fa-lightbulb'> </i> <h3>" +
					Object.keys(presets[i].conf.dmx).length +
					"</h3> </div>"
				);
			} else  {
				div.append(
					"<div> <i class='fas fa-lightbulb'> </i> <h3>0</h3> </div>"
				);
			}
			if (presets[i].conf.av["mode"]) {
				div.append(
					"<div> <i class='fas fa-volume-up'> </i> <h3>" +
					presets[i].conf.av.mode +
					"</h3> </div>"
				);
			} else {
				div.append(
					"<div> <i class='fas fa-volume-up'> </i> <h3> - </h3> </div>"
				);
			}
			if (typeof presets[i].conf.beamer.on !== "undefined") {
				if (presets[i].conf.beamer.on) {
					div.append(
						"<div> <i class='fas fa-video'> </i> <h3>ein</h3> </div>"
					);
				} else {
					div.append(
						"<div> <i class='fas fa-video'> </i> <h3>aus</h3> </div>"
					);
				}
			}else {
				div.append("<div> <i class='fas fa-video'> </i> <h3> aus </h3> </div>");
			}
			if (typeof presets[i].conf.mixer.mikrofone !== "undefined") {
				div.append(
					"<div> <i class='fas fa-microphone'> </i> <h3>" +
					Object.keys(presets[i].conf.mixer.mikrofone).length +
					"</h3> </div>"
				);
			} else  {
				div.append(
					"<div> <i class='fas fa-microphone'> </i> <h3>0</h3> </div>"
				);
			}
			$(".presentation").append(div);
			presetStart++;
		}
		$(".preset").on("click", selectPreset);
	};

	function selectPreset() {
		console.log(presets);
		send(presets[parseInt($(this).attr("data-preset"))].conf);
	}

	var firstLiveStatus = () => {
		console.log(ini.live.av);
		if (ini.live.av.volume) {
			console.log(ini.live.av.volume);
			buildStatus("Master", ini.live.av.volume, "dB", "avStatus");
		}
		console.log(ini.live.beamer);
		if (ini.live.beamer) {
			if (ini.live.beamer.on) {
				console.log("Beamer ein");
				buildStatus("Beamer", "ein", "", "beamerStatus");
				on = true;
			} else {
				console.log("Beamer aus");
				buildStatus("Beamer", "aus", "", "beamerStatus");
				on = false;
			}
		}
		if (ini.live.dmx) {
			console.log(ini.live.dmx);
			buildStatus("Scheinwerfer", ini.live.dmx.length, "", "dmxStatus");
		}
	};

	function deletePreset(id) {
		let preset = new FormData();
		preset.append("jwt", jwt);
		preset.append("id", id);
		console.log(preset);

		$.ajax({
				url: "/Mediatrix/php/src/deletePreset.php",
				traditional: true,
				method: "POST",
				data: preset,
				contentType: false,
				processData: false,
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				complete: () => {}
			})
			.done(data => {
				console.log("success: " + data);
				addPreset(currentConf);
				presets.push(currentConf);
				let message = "Das Preset " + $("#presetName").val() + " wurde erfolgreich erstellt";
				outputMesssage(message);
			})
			.fail(data => {
				console.log("error: ");
				console.log(data);
			});
	}

	function liveStatus(live) {
		let items = $(".statusGrid").contents();

		for (item of items) {
			let value = $(item).children();
			if (value[0].innerText == "Master") {
				let Master;
				if (value[1].innerText.length == 3) {
					Master = value[1].innerText.substring(0, 1);
				} else if (value[1].innerText.length == 4) {
					Master = value[1].innerText.substring(0, 2);
				} else if (value[1].innerText.length == 5) {
					Master = value[1].innerText.substring(0, 3);
				}
				if (parseInt(Master) != live.av.volume) {
					value[1].innerText = live.av.volume + "dB";
				}
			} else if (value[0].innerText == "Scheinwerfer") {
				if (value[1].innerText != live.dmx.length) {
					value[1].innerText = live.dmx.length;
				}
			} else if (value[0].innerText == "Beamer") {
				let active = live.beamer.on;
				let current = false;
				value[1].innerText == "ein" ?
					(current = true) :
					(current = false);
				if (active != current) {
					if (current) {
						value[1].innerText = "ein";
					} else {
						value[1].innerText = "aus";
					}
				}
			}
		}
	}

	function updateAvSlider() {
		document.getElementById("avSlider1").noUiSlider.set(val);
		document.getElementById("avSlider1Value").innerHTML = val;
		if(ini.live.av.volume !== undefined){
			document.getElementById("avSlider1Value").innerHTML = ini.live.av.volume;
			return true;
		} else {
			document.getElementById("avSlider1Value").innerHTML = "0";
		}
	};

	function setDMXSlider(id, val, col) {
		var slider = document.querySelector("#" + id + "Slider[data-col=" + col + "]");
		console.log(id + " " + val + " " + col);
		console.log(slider);
		
		slider.noUiSlider.set(val);
		$("#" + id + "Slider[data-col=" + col + "]").parent().find("#" + id + "Value").html(val);
	};

	function updateLive(live) {
		console.log("In der updateLive-Methode gelandet Live: ");
		console.log(live);

		if(live.av.volume !== null){
			document.getElementById("avSlider1").noUiSlider.set(val);
			document.getElementById("avSlider1Value").innerHTML = val;
		}

		for(let i=0; i<Object.keys(live.dmx).length; i++){
			console.log(Object.keys(live.dmx).length);
			if (Object.keys(live.dmx[i].channels).length == 1) {
				document.getElementById("Scheinwerfer" + i + "Slider").noUiSlider.set(live.dmx[i].channels.hue);
				document.getElementById("Scheinwerfer" + i + "Value").innerHTML = live.dmx[i].channels.hue;
				scheinwerfer[i].hue = live.dmx[i].channels.hue;
			}

			if (Object.keys(live.dmx[i].channels).length == 3) {
				setDMXSlider("Scheinwerfer" + i, live.dmx[i].channels.r, "r");
				setDMXSlider("Scheinwerfer" + i, live.dmx[i].channels.g, "g");
				setDMXSlider("Scheinwerfer" + i, live.dmx[i].channels.b, "b");
				scheinwerfer[i].r = live.dmx[i].channels.r;
				scheinwerfer[i].g = live.dmx[i].channels.g;
				scheinwerfer[i].b = live.dmx[i].channels.b;
			}

			if (Object.keys(live.dmx[i].channels).length == 4) {
				setDMXSlider("Scheinwerfer" + i, live.dmx[i].channels.r, "r");
				setDMXSlider("Scheinwerfer" + i, live.dmx[i].channels.g, "g");
				setDMXSlider("Scheinwerfer" + i, live.dmx[i].channels.b, "b");
				setDMXSlider("Scheinwerfer" + i, live.dmx[i].channels.w, "w");
				scheinwerfer[i].r = live.dmx[i].channels.r;
				scheinwerfer[i].g = live.dmx[i].channels.g;
				scheinwerfer[i].b = live.dmx[i].channels.b;
				scheinwerfer[i].w = live.dmx[i].channels.w;
			}
		}
		
	}

	$("#slots").on("change", function(ev){
		console.log(this.value);
		let slots = {
			group: {
				slots: parseInt(this.value)
			}
		}
		send(slots);
	});

	function buildStatus(key, value, unit, id) {
		var div = $("<div id='" + id + "'>");
		div.append("<span>" + key + "</span><span>" + value + unit + "</span>");
		$(".statusGrid").append(div);
	}

	function outputMessage(message) {
		$.snackbar({
			content: message
		});
	}

	function users(){

	}

	$(".tgl").on("click", () => {
		var mode = $(".tgl").prop("checked");
		if (mode) {
			var data = new FormData();
			data.append("jwt", jwt);
			data.append("ex", 1);
		} else {
			var data = new FormData();
			data.append("jwt", jwt);
			data.append("base", 1);
		}

		$.ajax({
				url: "/Mediatrix/php/src/changeUserMode.php",
				traditional: true,
				method: "POST",
				data: data,
				contentType: false,
				processData: false,
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true
			})
			.done(function (data) {
				if (mode) {
					toggleEx();
					isMobile = "ontouchstart" in document.documentElement &&
						navigator.userAgent.match(/Mobi/);
				} else {
					toggleBase();
					isMobile = "ontouchstart" in document.documentElement &&
						navigator.userAgent.match(/Mobi/);
				}
				console.log("success: mode: " + mode + " " + data);
				outputMessage("Der Modus wurde gewechselt");
			})
			.fail(function (data) {
				console.log("error ");
				console.log(data);
			});
	});

	//EventListener den Box Buttons hinzufügen
	$(".boxButtons").on("click", function () {
		toggleFlexContainer(1);
		togglePresMode(2);
		toggleStatus(1);

		if (isMobile) toggleMobileOptions(1);

		switch ($(this).attr("data-boxbtn")) {
			case "1":
				if ($("#beamerBox").parents(".flex-container").length == 1) {
					$("#beamerBox").remove();
				} else {
					$(".flex-container").append($("#beamerTemplate").html());
					$(".menu-item").each(function () {
						$(this).on("click", Beamer);
					});
					$(".menu-open-button").on("click", Beamer);
				}
				break;
			case "2":
				if ($("#avBox").parents(".flex-container").length == 1) {
					$("#avBox").remove();
				} else {
					if (selectAvConf()) {
						$(".mode").each(function () {
							this.addEventListener("click", Buttons);
						});
					}
				}
				break;
			case "3":
				if ($("#mikrofonBox").parents(".flex-container").length == 1) {
					$("#mikrofonBox").remove();
				} else {
					$(".flex-container").append($("#mikroTemplate").html());
					initSlider("#mikrofonBox");
					$(".mute").on("click", muteButton);
				}
				break;
			case "4":
				if ($(".lichtBox").parents(".flex-container").length == 1) {
					$(".lichtBox").remove();
				} else {
					if (selectLichtConf()) {
						console.log("SelectLichtConf ist fertig");
					}
				}
				break;
			case "5":
				console.log("Präsentationsmodus einblenden");
				$(".flex-container").empty();
				toggleFlexContainer(0);
				togglePresMode(0);
				toggleStatus(0);
				if (isMobile) {
					toggleMobileOptions(0);
				}
				break;
		}
	});

	var togglePresMode = count => {
		switch (count) {
			case 0:
				if ($(".presentation").hasClass("flex")) {
					$(".presentation").removeClass("flex");
				} else {
					$(".presentation").addClass("flex");
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
	};

	var toggleFlexContainer = count => {
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
	};

	var toggleStatus = count => {
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
				break;
			case 2:
				$(".statusBox").removeClass("toggleStatus");
		}
	};

	var toggleMobileOptions = count => {
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
	};

	var toggleBase = () => {
		toggleFlexContainer(0);
		togglePresMode(1);
		toggleStatus(2);
		$(".savePreset").css("display", "none");
		$(".side-nav ul").css("display", "none");
	};

	var toggleEx = () => {
		toggleFlexContainer(1);
		togglePresMode(2);
		toggleStatus(1);
		if (isMobile) {
			$(".savePreset").css("display", "none");
			$(".side-nav ul").css("display", "flex");
		} else  {
			$(".savePreset").css("display", "block");
			$(".side-nav ul").css("display", "flex");
		}
	};

	//Slider initialisieren, je nach dem, welche gerade im Markup eingeblendet sind
	function initSlider(container) {
		var sliders = $(container).find(".slider");
		var valueFields = $(container).find(".valueField");

		sliders.each(function (slider) {
			noUiSlider.create(this, {
				start: 0,
				format: wNumb({
					decimals: 0
				}),
				connect: [false, false],
				direction: "rtl",
				orientation: "vertical",
				range: {
					min: 0,
					max: 100
				}
			});
		});

		sliders.each(function (i, slider) {
			this.noUiSlider.on("slide", function (values, handle) {
				Slider(this);
				valueFields.get(i).innerHTML = values[handle];
			});
		});
	}
});