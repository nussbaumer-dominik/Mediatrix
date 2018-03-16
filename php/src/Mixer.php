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
    //$this->connectToScui($ipAddress);
  }

  //Verbindung mit Mischpult herstellen
  public function connectToScui($ipAddress) {
    // iwas mit cURL()
  }

  //Befehl an das Mischpult senden
  public function send($command) {
    //Ratchet/Pawl für WebSocket
  }

  //Mute Befehl erstellen
  public function mute($mute, $channel) {
    $command . "";
  }

  //Lautstärke regeln
  public function mix($val, $channel) {

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
