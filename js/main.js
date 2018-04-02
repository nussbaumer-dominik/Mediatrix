$(function() {
	var ini,
		sessId,
		presetStart = 0,
		presets,
		jwt = localStorage.getItem("jwt"),
		on = false,
		currentConf = { name: "", conf: {} },
		conf = {
			av: {},
			dmx: {},
			mixer: {
				mikrofone: []
			},
			beamer: {}
		};

	var mixerData = {
		mixer: { mikrofone: [] }
	};
	var socket = new WebSocket("wss://10.0.0.144/wss");

	//wirft eine Exception
	socket.onerror = error => {
		console.log("WebSocket Error: " + error);
	};

	//wird beim erfolgreichen Öffnen des Sockets ausgegeben
	socket.onopen = event => {
		if (jwt != null) {
			socket.send('{"jwt":"' + jwt + '","ini":1}');
		}
		console.log("socket open: " + socket + " " + event);
	};

	//wird bei Response des Servers ausgegeben
	socket.onmessage = event => {
		if (JSON.parse(event.data)["ini"]) {
			console.log("das ist der ini-string: " + event.data);
			ini = (JSON && JSON.parse(event.data)) || $.parseJSON(event.data);
			presets = ini.ini.presets;
			liveStatus();
			getPresets();
			toggleBase();
		} else {
			console.log("message: " + event.data);
			console.log(event);
			$(".statusGrid").empty();
			liveStatus();
		}
	};

	//wird ausgegeben, wenn die Verbindung gekappt wurde
	socket.onclose = event => {
		console.log("socket closed: " + socket + " " + event);
	};

	//Daten versenden
	var send = data => {
		data.jwt = jwt;
		socket.send(JSON.stringify(data));
		console.log(JSON.stringify(data));
	};

	//Werte der Slider auslesen
	function Slider(slider) {
		switch (slider.target.getAttribute("data-type")) {
			case "av":
				console.log(
					"Dieser Slider ist von einem AV-Receiver: " +
						slider.target.getAttribute("data-type")
				);
				var data = {
					av: {
						value: slider.get(),
						channel: slider.target.getAttribute("data-id")
					}
				};
				conf.av = {
					value: slider.get(),
					channel: slider.target.getAttribute("data-id")
				};
				send(data);
				return data;
				break;
			case "mixer":
				let id = slider.target.getAttribute("data-id");
				let val = slider.get() / 100;
				console.log("MixerData: ");
				console.log(mixerData);
				if (!isNaN(id)) {
					console.log(
						"Dieser Slider ist von einem Mixer: " + slider.get()
					);
					var obj = { id: id, value: val };
					mixerData.mixer.mikrofone = [obj];
					console.log(conf.mixer.mikrofone.length);

					for (let i = 0; i <= conf.mixer.mikrofone.length; i++) {
						console.log("Durchlauf Nr.: " + (i + 1));

						if (conf.mixer.mikrofone.find(el => el.id === id)) {
							console.log("id vorhanden");
							console.log(el);
							conf.mixer.mikrofone[i].value = val;
						} else {
							console.log("id nicht vorhanden");
							conf.mixer.mikrofone[i] = obj;
						}
					}
					/*if (Object.keys(conf.mixer.mikrofone).length < 2) {
						if(){

						}
						conf.mixer.mikrofone.push(obj);
					} else {
						for (
							let i = 0;
							i <= Object.keys(conf.mixer.mikrofone).length;
							i++
						) {
							console.log(i);
							if (conf.mixer.mikrofone[i].id == id) {
								conf.mixer.mikrofone[i].value = val;
							}
						}
					}*/

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
			case "hue":
				console.log(
					"Dieser Slider ist von einem DMX Gerät: " +
						slider.target.getAttribute("data-id") +
						" " +
						slider.get()
				);
				var data = {
					dmx: {
						scheinwerfer: {
							id: slider.target.getAttribute("data-id"),
							hue: slider.get()
						}
					}
				};
				conf.dmx = {
					scheinwerfer: {
						id: slider.target.getAttribute("data-id"),
						hue: slider.get()
					}
				};
				send(data);
				return data;
				break;
			case "rgbw":
				console.log(
					"Dieser Slider ist von einem DMX Gerät: " +
						"Id: " +
						slider.target.getAttribute("data-id") +
						" " +
						slider.get()
				);
				var data = {
					dmx: {
						scheinwerfer: {
							id: slider.target.getAttribute("data-id"),
							[slider.target.getAttribute(
								"data-col"
							)]: slider.get()
						}
					}
				};
				conf.dmx = {
					scheinwerfer: {
						id: slider.target.getAttribute("data-id"),
						[slider.target.getAttribute("data-col")]: slider.get()
					}
				};
				send(data);
				return data;
				break;
		}
	}

	function muteButton() {
		var $this = $(this);
		console.log($this);
		if ($this.attr("data-type") == "mixer") {
			if ($this.attr("data-state") == "0") {
				$this.attr("data-state", "1");
				var data = {
					id: $this.attr("data-id"),
					mute: 1
				};
				$.snackbar({
					content: "Das Mikrofon wurde stumm geschalten"
				});
				conf.mixer.mute = 1;
			} else {
				$this.attr("data-state", "0");
				//var command = "3:::SETD^i."+ $(this).attr("data-id") +".mute^"+0;
				var data = {
					id: $this.attr("data-id"),
					mute: 0
				};
				conf.mixer.mute = 0;
			}
		}
		send(data);
	}

	$(".mute").on("click", muteButton);

	//Werte der Beamer Steuerung auslesen
	var Beamer = () => {
		var data = {
			beamer: {}
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
				} else if ($(this).attr("data-value") == "freeze") {
					data.beamer.freeze = 1;
					conf.beamer.freeze = 1;
				} else if ($(this).attr("data-value") == "blackout") {
					data.beamer.blackout = 1;
					conf.beamer.blackout = 1;
				}
				send(data);
			}
		}
	};

	//Werte der Modi des AV-Receivers auslesen
	var Buttons = () => {
		var data = {
			av: {
				mode: ""
			}
		};
		if ($(this).attr("data-type") == "av") {
			console.log(
				"Data-type=" +
					$(this).attr("data-type") +
					" Value: " +
					$(this).html()
			);
			data.av.mode = $(this).html();
			console.log(data);
		}
	};

	var selectAvConf = () => {
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
		var slider = document.querySelector("#avSlider1");
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
		slider.noUiSlider.on("slide", function(values, handle) {
			Slider(this);
			document.getElementById("avSlider1Value").innerHTML =
				values[handle];
		});
		updateSliders();
		return true;
	};

	var selectLichtConf = () => {
		console.log("selectLichtConf");
		for (let i = 0; i < Object.keys(ini.ini.dmx).length; i++) {
			var scheinwerfer = ini.ini.dmx["scheinwerfer" + i];
			if (scheinwerfer.numberChannels == "4") {
				var t = document.querySelector("#rgbwTemplate").innerHTML;

				for (
					let j = 0;
					j < parseInt(scheinwerfer.numberChannels);
					j++
				) {
					t = t.replace(/{:id}/, scheinwerfer.id + 1);
				}

				t = t.replace(/{:lightNumber}/, scheinwerfer.id);
				$(".flex-container").append(t);
			} else if (scheinwerfer.numberChannels == "1") {
				var t = document.querySelector("#hueTemplate").innerHTML;
				for (
					let j = 0;
					j < parseInt(scheinwerfer.numberChannels);
					j++
				) {
					t = t.replace(/{:id}/, scheinwerfer.id);
				}
				t = t.replace(/{:lightNumber}/, scheinwerfer.id + 1);
				$(".flex-container").append(t);
			}
		}
		return true;
	};

	var selectMixerConf = () => {
		console.log("selectMixerConf");
	};

	$("#savePreset").on("click", ev => {
		ev.preventDefault();
		console.log("Preset '" + $("#presetName").val() + "' speichern");
		var name = $("#presetName").val();
		currentConf.name = name;
		currentConf.conf = conf;
		console.dir(currentConf);

		var data = new FormData();
		data.append("jwt", jwt);
		data.append("name", currentConf.name);
		data.append("conf", currentConf.conf);
		console.log(data);

		$.snackbar({
			content:
				"Das Preset " +
				$("#presetName").val() +
				" wurde erfolgreich erstellt"
		});

		$.ajax({
			url: "/Mediatrix/php/src/savePreset.php",
			traditional: true,
			method: "POST",
			data: data,
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
			})
			.fail(data => {
				console.log("error: ");
				console.log(data);
			});
	});

	var getPresets = () => {
		for (let i = presetStart; i < Object.keys(presets).length; i++) {
			console.log(presets[i].name + " conf:");
			console.log(presets[i].conf);

			var div = $("<div/>", {
				class: "preset"
			}).attr("data-preset", i);
			div.append("<h2>" + presets[i].name + "</h2>");
			if (presets[i].conf.dmx) {
				var count = 0;
				for (let key in presets[i].conf)
					if (presets[i].conf.hasOwnProperty(key)) count++;
				div.append(
					"<div> <i class='fas fa-lightbulb'> </i> <h3>" +
						count +
						"</h3> </div>"
				);
			} else if (presets[i].conf.av) {
				div.append(
					"<div> <i class='fas fa-volume-up'> </i> <h3>" +
						presets[i].conf.av.mode +
						"</h3> </div>"
				);
			} else if (presets[i].conf.beamer) {
				div.append(
					"<div> <i class='fas fa-video'> </i> <h3>" +
						presets[i].conf.beamer +
						"</h3> </div>"
				);
			} else if (presets[i].conf.mixer) {
				div.append(
					"<div> <i class='fas fa-microphone'> </i> <h3>" +
						presets[i].conf.mixer +
						"</h3> </div>"
				);
			}
			$(".presentation").append(div);
			presetStart++;
		}
		$(".preset").on("click", selectPreset);
	};

	function selectPreset(data) {
		console.log(presets);
		send(presets[parseInt($(this).attr("data-preset"))]);
	}

	var liveStatus = () => {
		buildStatus("Master", ini.live.av.volume, "dB");
		//buildStatus("Beamer", ini.live.beamer.source, "");
		buildStatus("Helligkeit", ini.live.dmx[0], "");
	};

	var updateSliders = () => {
		setSlider("avSlider1", ini.live.av.volume);
		document.getElementById("avSlider1Value").innerHTML =
			ini.live.av.volume;
	};

	var buildStatus = (key, value, unit) => {
		var div = $("<div>");
		div.append("<span>" + key + "</span><span>" + value + unit + "</span>");
		$(".statusGrid").append(div);
	};

	$(".tgl").on("click", () => {
		var mode = $(".tgl").prop("checked");
		console.log(mode);
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
			.done(function(data) {
				if (mode) {
					toggleEx();
				} else {
					toggleBase();
				}
				console.log("success: mode: " + mode + " " + data);
			})
			.fail(function(data) {
				console.log("error ");
				console.log(data);
			});
	});

	var isMobile =
		"ontouchstart" in document.documentElement &&
		navigator.userAgent.match(/Mobi/);

	//EventListener den Box Buttons hinzufügen
	$(".boxButtons").on("click", function() {
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
					$(".menu-item").each(function() {
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
						$(".mode").each(function() {
							this.addEventListener("click", Buttons);
						});
					}
				}
				break;
			case "3":
				if ($("#mikrofonBox").parents(".flex-container").length == 1) {
					$("#mikrofonBox").remove();
				} else {
					selectMixerConf();
					$(".flex-container").append($("#mikroTemplate").html());
					initSlider("#mikrofonBox");
					//$(".mute").on("click", muteButton);
				}
				break;
			case "4":
				if ($(".lichtBox").parents(".flex-container").length == 1) {
					$(".lichtBox").remove();
				} else {
					if (selectLichtConf()) {
						console.log("SelectLichtConf ist fertig");
						initSlider(".lichtBox");
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
					//getPresets(".presentation");
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

	var setSlider = (id, val) => {
		var slider = document.getElementById(id);
		slider.noUiSlider.set(val);
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
		$(".savePreset").css("display", "block");
		$(".side-nav ul").css("display", "block");
	};

	//Slider initialisieren, je nach dem, welche gerade im Markup eingeblendet sind
	var initSlider = function(container) {
		var sliders = $(container).find(".slider");
		var valueFields = $(container).find(".valueField");

		sliders.each(function(slider) {
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

		sliders.each(function(i, slider) {
			this.noUiSlider.on("slide", function(values, handle) {
				Slider(this);
				valueFields.get(i).innerHTML = values[handle];
			});
		});
	};
});
