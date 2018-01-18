<?php

namespace Mediatrix;


class Scheinwerfer{

    private $channels = array();
    private $dmx;


    function __construct(array $channels){
      $this->channels = $channels;
      $this->dmx = new \DMX();


    }

    function dimmen(int $val){
      return $this->dmx->sendChannel(array(
        $this->channels["hue"] => $val
      ));


    }

    function on(): boolean{
      return $this->dmx::sendChannel(array(
        $this->channels["hue"] => 255
      ));
    }

    function off(): boolean {
      return $this->dmx::sendChannel(array(
        $this->channels["hue"] => 0
      ));
    }
}
