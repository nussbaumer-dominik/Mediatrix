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
        try{
            $this->mixer->mix($value, $this->channelId);
        } catch (Exception $ex) {
            return array("success" => false, "err" => "" . $ex);
        }
        return array("success" => true, "err" => "");
    }
    function mute($muted){
        try{
            $this->mixer->mute($muted, $this->channelId);
        } catch (Exception $ex) {
            return array("success" => false, "err" => "" . $ex);
        }
        return array("success" => true, "err" => "");
    }
}
