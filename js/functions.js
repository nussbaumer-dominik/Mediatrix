$(document).ready(function() {

  //Add EventListener to Box Buttons
  $(".boxButtons").on("click", function() {

    toggleStatus(1);
    //iterate over the boxes
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

      toggleStatus(0);
    }
  });

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



// Vanilla JS Version -- sicherheitshalber aufheben
/*window.onload = function() {

    // Variablen
    var boxButtons = document.getElementsByClassName("boxButtons");
    var boxes = document.getElementsByClassName("box");

    function toggleBoxes() {
        for (var el of boxes) {
            if (this.getAttribute("data-boxbtn") == el.getAttribute("data-box")) {
                el.className = 'box visible' == el.className ? 'box' : 'box visible';
            }
        }
    }

// EventListener zu den Buttons hinzufügen
    for (var i = 0; i < boxButtons.length; i++) {
        boxButtons[i].addEventListener('click', toggleBoxes, false);
    }
}
*/
