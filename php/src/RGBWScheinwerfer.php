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
            $data[$this->channels['w']] = $val['w'];
        }

        $r = json_decode(str_replace("'",'"',$this->dmx::sendChannel()));

        return $r;
    }

}