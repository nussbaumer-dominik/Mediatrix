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
      return json_decode($this->dmx->sendChannel(array(
        $this->channels["hue"] => $val
      )));


    }

    function on(){
      return json_decode($this->dmx::sendChannel(array(
        $this->channels["hue"] => 255
      )));
    }

    function off(){
      return json_decode($this->dmx::sendChannel(array(
        $this->channels["hue"] => 0
      )));
    }
}
