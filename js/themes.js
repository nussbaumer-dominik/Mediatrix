$(() => {
	let root = document.querySelector(":root");
	var rootStyles = getComputedStyle(root);
	let options = [
		"--color",
		"--icons",
		"--body",
		"--sidebar",
		"--bg",
		"--border-color",
		"--btn-border-color",
		"--btn-hover-color",
		"--fader-color",
		"--tooltip",
		"--modal-btn",
		"--extendedBtn"
	];

	//Themes
	let dark = [
		"#ECECEC",
		"#fff",
		"#282B2F",
		"#16191C",
		"#393A3F",
		"none",
		"#fff",
		"#393A3F",
		"#f7f7f7",
		"#393A3F",
		"#f7f7f7",
		"#282B2F"
	];
	let minimalDark = [
		"#ECECEC",
		"#fff",
		"#16191C",
		"#16191C",
		"#282B2F",
		"none",
		"#fff",
		"#393A3F",
		"#f7f7f7",
		"#393A3F",
		"#f7f7f7",
		"#282B2F"
	];
	let whiteBlue = [
		"#1E283D",
		"#fff",
		"#F5F6FA",
		"#1E283D",
		"#fff",
		"#1E283D",
		"#2B3545",
		"#fff",
		"#1E283D",
		"#fff",
		"#1E283D",
		"#282B2F"
	];
	let minimalLight = [
		"#1E283D",
		"#1E283D",
		"#F4F6F8",
		"#F4F6F8",
		"#fff",
		"none",
		"#2B3545",
		"#fff",
		"#1E283D",
		"#fff",
		"#1E283D",
		"#282B2F"
	];

	$(".themeBtn").on("click", function() {
		switch ($(this).attr("value")) {
			case "dark":
				for (var i = 0; i < options.length; i++) {
					root.style.setProperty(options[i], dark[i]);
				}
				break;
			case "minimalDark":
				for (var i = 0; i < options.length; i++) {
					root.style.setProperty(options[i], minimalDark[i]);
				}
				break;
			case "whiteBlue":
				for (var i = 0; i < options.length; i++) {
					root.style.setProperty(options[i], whiteBlue[i]);
				}
				break;
			case "minimalLight":
				for (var i = 0; i < options.length; i++) {
					root.style.setProperty(options[i], minimalLight[i]);
				}
				break;
		}
	});

	$(".presetTrigger").click(function() {
		$(".modal-wrapper").toggleClass("open");
		$("#presetModal").toggleClass("open");
	});

	$(".modal-wrapper").click(function() {
		$(".modal-wrapper").toggleClass("open");
		$("#presetModal").toggleClass("open");
	});

	/*$(".presetTrigger").click(function() {
		$(".modal-wrapperGroup").toggleClass("open");
		$("#groupModal").toggleClass("open");
	});*/

	/*$(".modal-wrapper").click(function() {
		$(".modal-wrapperGroup").toggleClass("open");
		$("#groupModal").toggleClass("open");
	});*/
});
