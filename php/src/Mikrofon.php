<?php
/**
 * Created by PhpStorm.
 * User: nuss
 * Date: 16.03.2018
 * Time: 08:26
 */
namespace Mediatrix;
class Mikrofon {
    protected $mixer;
    protected $channelId;
    function __construct($mixer, $channelId)
    {
        $this->mixer = $mixer;
        $this->channelId = $channelId;
    }
    function setVolume($value){
        echo "Lautstärke verändern\n";
        return $this->mixer->mix($value, $this->channelId);

    }
    function mute($muted){

        echo "Mute Mikrofone\n";
        return $this->mixer->mute($muted, $this->channelId);

    }
}
