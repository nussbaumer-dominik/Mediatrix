<?php

namespace Mediatrix;


class Scheinwerfer{

    private $channels = array();
    private $dmx;


    function __construct(array $channels){
      $this->channels = $channels;
      $this->dmx = new \DMX();

      var_dump($this->dmx);
    }

    function dimmen(int $val): boolean{
      $this->dmx->sendChannel(array(
        $this->channels["hue"] => $val
      ));

      return true;
    }

    function on(): boolean{
      $this->dmx::sendChannel(array(
        $this->channels["hue"] => 255
      ));
    }

    function off(): boolean {
      $this->dmx::sendChannel(array(
        $this->channels["hue"] => 0
      ));
    }
}
