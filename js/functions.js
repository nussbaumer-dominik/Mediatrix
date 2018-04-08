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
          initSlider();
        }
        break;
      case "3":
        if($("#mikrofonBox").parents(".flex-container").length == 1 ){
          $("#mikrofonBox").remove();
        }else{
          $(".flex-container").append($("#mikroTemplate").html());
          initSlider();
        }
        break;
      case "4":
        if($("#lichtBox").parents(".flex-container").length == 1 ){
          $("#lichtBox").remove();
        }else{
          $(".flex-container").append($("#lichtTemplate").html());
          initSlider();
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

  function initSlider(){
    var sliders = document.querySelectorAll(".slider");
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
        $(".valueField")[i].innerHTML =
          values[handle];
      });
    });
  }
});
