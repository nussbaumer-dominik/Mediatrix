/**
 * Created by nuss on 31.01.18.
 */
$(document).ready(function() {

    var boxButtons = document.getElementsByClassName("boxButtons");
    var boxes = document.getElementsByClassName("box");

    /* EventListener zu den Buttons hinzufügen
    for (var j = 0; j < boxButtons.length; j++) {
        boxButtons[j].addEventListener('click', visible, false);
    }*/

    $(".boxButtons").on("click", function() {
        $(".boxButtons").toggle(function() {
            console.log(
                "First handler for .toggle() called."
            );
            //$('div').append('<input type="text"..etc ');
        }, function() {
            console.log(
                "Second handler for .toggle() called."
            );
        });
    });
});
