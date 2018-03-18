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
    $req = curl_init($ipAddress . "/socket.io");
    curl_setopt($req, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($req, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($req, CURLOPT_AUTOREFERER, TRUE);
    $result = curl_exec($req);

    echo $result;

    curl_close ($req);
  }

  //Befehl an das Mischpult senden
  public function send($command) {
    try {
      \Ratchet\Client\connect("ws://"+ $ipAddress)->then(function($conn) {
          $conn->on("Got message", function($msg) use ($conn) {
              echo "Erhalten: {$msg}\n";
              $conn->close();
          });

          $conn->send($command);
          return array("success" => true, "err" => "");
      }, function ($e) {
          echo "Verbindung fehlgeschlagen: {$e->getMessage()}\n";
      });
    }catch {
      return array("success" => false, "err" => "");
    }
  }

  //Mute Befehl erstellen
  public function mute($mute, $channel) {
    $command = $command . $channel . "mute" . $mute;
    send($command);
  }

  //Lautstärke regeln
  public function mix($val, $channel) {
    $command = $command . $channel . "mix^" . $val;
    send($command);
  }

  public function alive() {
      echo "Alive\n";
      send($alive);
  }

  public function setLineVolume($val) {
    var $commandl = "3:::SETD^l.0.mix^" . $val;
    var $commandr = "3:::SETD^l.1.mix^" . $val;
    send($commandl);
    send($commandr);
  }

  public function setMasterVolume($val) {
    var $command = "3:::SETD^m.mix^" . $val;
    send($command);
  }
}
