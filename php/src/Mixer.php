<?php
namespace Mediatrix;
class Mixer {

  //Variablen
  protected $session_id;
  protected $mixer;
  protected $command = "3:::SETD^i.";
  protected $alive = "3:::ALIVE";

  //Konstruktor
  public function __construct(string $ipAddress) {
    $this->connectToScui($ipAddress);
  }

  //Verbindung mit Mischpult herstellen
  public function connectToScui($ipAddress) {
    $req = curl_init();
    curl_setopt($req, CURLOPT_HEADER, 0);
    curl_setopt($req, CURLOPT_VERBOSE, 1);
    curl_setopt($req, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($req, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($req, CURLOPT_FAILONERROR, 0);
    curl_setopt($req, CURLOPT_URL, $ipAddress . "/socket.io");

    $return = curl_exec($req);

    curl_close ($req);
    var_dump($return);
  }

  //Befehl an das Mischpult senden
  public function send($command) {
    \Ratchet\Client\connect("ws://"+ $ipAddress)->then(function($conn) {
        $conn->on("Got message", function($msg) use ($conn) {
            echo "Erhalten: {$msg}\n";
            $conn->close();
        });

        $conn->send($command);
    }, function ($e) {
        echo "Verbindung fehlgeschlagen: {$e->getMessage()}\n";
    });
  }

  //Mute Befehl erstellen
  public function mute($mute, $reqannel) {
    $command = $command . $reqannel . "mute" . $mute;
    send($command);
  }

  //Lautstärke regeln
  public function mix($val, $reqannel) {
    $command = $command . $reqannel . "mix^" . $val;
    send($command);
  }

  public function alive() {
      echo "Alive\n";
  }

  public function setLineVolume($val) {

      return array("success" => true, "err" => "");
  }

  public function setMasterVolume($val) {

    return array("success" => true, "err" => "");
  }
}
