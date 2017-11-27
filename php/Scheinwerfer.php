<?php

declare(strict_types=1);

namespace Mediatrix;

class Scheinwerfer{

    private $channels = array();
    private $dmx;

    function __constructor(array $channels){
      $this->channels = $channels;
        $this->dmx = new DMX();
    }

    function dimmen(int $val): boolean{
      $this->dmx->sendChannel(array(
        $this->channels["hue"] => $val
      ));
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
