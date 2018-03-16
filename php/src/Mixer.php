<?php

namespace Mediatrix;


class Mixer {
  //Variablen
  protected $session_id;
  protected $mixer;
  protected $command = "3:::SETD^i.";
  protected $alive = "3:::ALIVE";

  //Konstruktor
  public function __construct() {

  }

  //Verbindung mit Mischpult herstellen
  public function connectToScui() {

  }

  //Befehl an das Mischpult senden
  public function send($command) {

  }

  //Mute Befehl erstellen
  public function mute($mute, $channel) {

  }

  //Lautstärke regeln
  public function mix($val, $channel) {

  }

  public function alive(){
      echo "Alive\n";
  }

  /**
   * @return array
   */
  public function getVolume(){

  }
}
