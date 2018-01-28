<?php

namespace Mediatrix;


class Scheinwerfer
{

    protected $channels = array();
    protected $dmx;


    function __construct(array $channels)
    {
        $this->channels = $channels;
        $this->dmx = new \DMX();
    }

    function dimmen(int $val)
    {
        return json_decode(
            str_replace("'", '"',
                $this->dmx::sendChannel(
                    array(
                        $this->channels["hue"] => $val
                    )
                )
            )
        );
    }

    function on()
    {
        return json_decode(
            str_replace("'", '"',
                $this->dmx::sendChannel(
                    array(
                        $this->channels["hue"] => 255
                    )
                )
            )
        );
    }

    function off()
    {
        return json_decode(
            str_replace("'", '"',
                $this->dmx::sendChannel(
                    array(
                        $this->channels["hue"] => 0
                    )
                )
            )
        );
    }
}
