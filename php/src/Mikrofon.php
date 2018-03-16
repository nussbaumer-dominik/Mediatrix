<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 16.03.2018
 * Time: 08:26
 */
namespace Mediatrix;
class Mikrofon
{
    protected $mixer;
    protected $channelId;
    function __construct($mixer, $channelId)
    {
        $this->mixer = $mixer;
        $this->channelId = $channelId;
    }
    function setVolume($value){
        return array("success" => true, "err" => "");
    }
    function mute(){
        return array("success" => true, "err" => "");
    }
}
