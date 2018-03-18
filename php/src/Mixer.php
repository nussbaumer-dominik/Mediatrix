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
    $url = $ipAddress . "/socket.io";
    $req = curl_init();
    curl_setopt($req, CURLOPT_URL, $this->$url);
    curl_setopt($req, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($req, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($req, CURLOPT_AUTOREFERER, TRUE);
    $result = curl_exec($req);

    $session_id = substr($result, 0, 20);

    echo $result;
    curl_close ($req);
  }

  //Befehl an das Mischpult senden
  public function send($command) {
    try {
      \Ratchet\Client\connect("ws://"+ $ipAddress . "socket.io/1/websocket" . $session_id)->then(function($conn) {
          $conn->on("Got message", function($msg) use ($conn) {
              echo "Erhalten: {$msg}\n";
              $conn->close();
          });

          $conn->send($command);
          return array("success" => true, "err" => "");
      }, function ($e) {
          echo "Verbindung fehlgeschlagen: {$e->getMessage()}\n";
      });
    }catch (Exception $ex){
      return array("success" => false, "err" => $ex);
    }
  }

  //Mute Befehl erstellen
  public function mute($mute, $channel) {
    $command = $command . $channel . "mute" . $mute;
    $this->send($command);
  }

  //Lautstärke regeln
  public function mix($val, $channel) {
    $command = $command . $channel . "mix^" . $val;
    $this->send($command);
  }

  public function alive() {
    echo "Alive\n";
    $this->send($alive);
  }

  public function setLineVolume($val) {
    $commandl = "3:::SETD^l.0.mix^" . $val;
    $commandr = "3:::SETD^l.1.mix^" . $val;
    $this->send($commandl);
    $this->send($commandr);
  }

  public function setMasterVolume($val) {
    $command = "3:::SETD^m.mix^" . $val;
    $this->send($command);
  }
}
