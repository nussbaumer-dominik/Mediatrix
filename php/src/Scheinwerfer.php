<?php

namespace Mediatrix;


class Scheinwerfer
{

    protected $channels = array();
    protected $dmx;


    public function __construct(array $channels)
    {
        $this->channels = $channels;
        $this->dmx = new \DMX();
        $this->off();
    }

    public function dimmen(int $val)
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

    public function on()
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

    public function off()
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

    /**
     * @return array
     */
    public function getChannels(): array
    {
        return $this->channels;
    }
}
