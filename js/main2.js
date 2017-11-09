var camera = document.getElementById("camera");
var cameraBox = document.getElementById("cameraBox");
var data;
var requestOn;
var lastSrc = 0;

function visible() {
  cameraBox.className = 'box visible' == cameraBox.className ? 'box' : 'box visible';
}


camera.addEventListener("click", visible);

//function to get the JSON-file with the Codes
function getData(){
  var request = new XMLHttpRequest();

  request.open('GET', 'Data/Data.json', true);

  request.onload = function () {
    // begin accessing JSON data here
    data = JSON.parse(this.response);
  }

  request.send();
}

//call function to get Codes from server
getData();


/**
*  Function to send the codes to the server
*  return updated codes array
**/
function sendCode(codes, callback) {
  /*
  * newer version with fetch and Promise, not supported on Safari an Android


  return new Promise(function(reslove, reject){

    //checking if 2 codes + boolean are passed
    if(codes.length < 3 || codes.length > 3){
      resolve(codes);
    }

    //checking if no other request is still going
    if(requestOn){
      error("Request still on")
      resolve(codes);
    }


    //start blocking other requests
    requestOn = true;

    //create POST-Data
    postdata = new FormData();
    postdata.append("codeA", codes['codeA']);
    postdata.append("codeB", codes['codeB']);
    postdata.append("lastSendA", codes['lastSendA']);
    postdata.append("times", codes['times']);

    //call send.php on server with POST-Data
    fetch("/php/send.php", {
      method: "POST",
      body: postdata,
      credentials: "include"
    })

    //expect JSON as response
    .then(function(response){
      return response.json();
    })

    //handle response of server
    .then(function(r){
      if(!r.exitcode == 0){
        requestOn = false;
        error(r.output);
        Promise.resolve(codes);
      }

      //end blocking other requests
      requestOn = false;

      codes['lastSendA'] = !codes['lastSendA'];

      Promise.resolve(codes);

    })

    //handle error while calling send.php
    .catch(function(er){
      //end blocking other requests
      requestOn = false;

      error(er);

      Promise.resolve(codes);
    });

  });
  */

  //checking if 2 codes + callback are passed
  if(codes.length < 3 || codes.length > 3){
    callback(codes);
    return;
  }

  //checking if no other request is still going
  if(requestOn){
    error("Request still running")
    callback(codes);
    return;
  }

  //start blocking other requests
  requestOn = true;

  //create POST-Data
  postdata = new FormData();
  postdata.append("codeA", codes['codeA']);
  postdata.append("codeB", codes['codeB']);
  postdata.append("lastSendA", codes['lastSendA']);
  postdata.append("times", codes['times']);

  var request = new XMLHttpRequest();
  request.open('POST', '/php/send.php', true);  // `false` makes the request synchronous

  request.onload = function () {
    resp = JSON.parse(this.response);
    if(resp.exitcode == 0){
      //end blocking other requests
      requestOn = false;

      codes['lastSendA'] = !codes['lastSendA'];

      callback(codes);
      return;
    }else if(resp.exitcode == 2){
      error("Session expired, Page will be reloaded")
      setTimeout(function() {location.reload()},1000);
    }else{
      requestOn = false;
      error(resp.output);
      callback(codes);
      return;
    }
  }

  request.onerror = function () {
    requestOn = false;

    error("Error while sending code.");
    callback(codes);
  }

  request.send(postdata);
}


//Error
function error(message) {
  $.snackbar({content: message, timeout: 2000});
}


//function for handling clicks on UP, DOWN, LEFT, RIGHT, OK
function navClick(evt){
  var id = evt.target.id;
  if(id ===  ""){
    id = evt.target.parentElement.id;
  }

  sendCode(data.nav[id], function (codes) {
    data.nav[id] = codes;
  });
}


//function to hadnle clicks on SRC
function srcClick(evt){

  lastSrc>=data.src.length ? lastSrc=0 : lastSrc++;

   sendCode(data.src[Object.keys(data.src)[lastSrc]], function(codes) {
     data.src[Object.keys(data.src)[lastSrc]] = codes;
  });

}

//function to handle clicks on MENU, POWER
function menuClick(evt){
  var id = evt.target.id;
  if(id ===  ""){
    id = evt.target.parentElement.id;
  }

  sendCode(data[id], function (codes) {
    data[id] = codes;
  });
}

function powerClick(evt){
  id = evt.target.id;

  if(id ===  ""){
    id = evt.target.parentElement.id;
  }

  sendCode(data[id], function (codes) {
    data[id] = codes;
  });

  if(!document.getElementById(id).checked){
    setTimeout(function(){
      sendCode(data[id], function (codes) {
        data[id] = codes;
      });
    }, 4000);
  }
}



//adding Eventlisteners to Buttons
document.getElementById('power').addEventListener("click", powerClick);
document.getElementById('menu').addEventListener("click", menuClick);
document.getElementById('src').addEventListener("click", srcClick);

var buttons = document.getElementsByClassName('clickable');
for(var i=0; i < buttons.length;i++){
  buttons[i].addEventListener("click", navClick);
}
