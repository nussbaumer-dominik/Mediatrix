<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 27.01.2018
 * Time: 21:23
 */

namespace Mediatrix;


class RGBWScheinwerfer extends Scheinwerfer
{

    /**
     * @param array $val
     * @return mixed
     */
    function dimmen(array $val)
    {
        $data = array(
            $this->channels["r"] => $val['r'],
            $this->channels['g'] => $val['g'],
            $this->channels['b'] => $val['b']
        );

        if(count($val) == 4 && count($this->channels) == 4){
            if(isset($this->channels['w']) && isset($val['w'])) {
                $data[$this->channels['w']] = $val['w'];
            }else if(isset($this->channels['hue'])){
                $data[$this->channels['hue']] = 255;
            }else{
                return (object) array("success"=>false,"err"=>"Worng Channels for Scheinwerfer");
            }
        }

        if(count($val) == 4 && count($this->channels) == 5){
            $data[$this->channels['w']] = $val['w'];
            $data[$this->channels['hue']] = 255;
        }else{
            return (object) array("success"=>false,"err"=>"Worng Channels for Scheinwerfer");
        }

        $r = json_decode(str_replace("'",'"',$this->dmx::sendChannel($data)));

        return $r;
    }

    function off()
    {
        $data = array(
          $this->channels['r'] => 0,
          $this->channels['g'] => 0,
          $this->channels['b'] => 0
        );

        if(isset($this->channels['w'])){
            $data[$this->channels['w']] = 0;
        }

        if(isset($this->channels['hue'])){
            $data[$this->channels['hue']] = 0;
        }

        return json_decode(
            str_replace("'", '"',
                $this->dmx::sendChannel(

                        $data

                )
            )
        );
    }

    function on()
    {
        $data = array(
            $this->channels['r'] => 255,
            $this->channels['g'] => 255,
            $this->channels['b'] => 255
        );

        if(isset($this->channels['w'])){
            $data[$this->channels['w']] = 255;
        }

        if(isset($this->channels['hue'])){
            $data[$this->channels['hue']] = 255;
        }

        return json_decode(
            str_replace("'", '"',
                $this->dmx::sendChannel(

                        $data

                )
            )
        );
    }

    function getChannels(): array
    {
        $erg = $this->channels;

        if(isset($this->channels['hue'])){
            unset($erg['hue']);
        }

        var_dump($erg);

        return $erg;
    }
}