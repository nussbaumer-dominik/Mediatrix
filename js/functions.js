$(document).ready(function() {

  //EventListener den Box Buttons hinzufügen
  $(".boxButtons").on("click", function() {

    toggleFlexContainer(1);
    togglePresMode(2);
    toggleStatus(1);
    //über die Boxelemente iterieren
    for (var el of $(".box")) {
      //If Box Button matches Box -> show or hide it
      if (this.getAttribute("data-boxbtn") == el.getAttribute(
          "data-box")) {
        el.className = "box visible" == el.className ?
          "box" : "box visible";

      }
    }

    if (this.getAttribute("data-boxbtn") == "5") {
      console.log("Präsentationsmodus einblenden");
      //hide all boxes
      for (var el of $(".box")) {
        el.className = "box";
      }
      toggleFlexContainer(0);
      togglePresMode(0);
      toggleStatus(0);
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
});
