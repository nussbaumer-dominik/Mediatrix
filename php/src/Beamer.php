<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 27.12.2017
 * Time: 11:23
 */

namespace Mediatrix;


class Beamer
{
    private $source = array();
    private $powerCode = array();
    private $ir;

    public function __construct(array $source, array $powerCode)
    {
        foreach ($source as $k => $s){
            $source[$k]['nextActive'] = false;
            $source[$k]['lastSendA'] = false;
        }

        $source[0]['nextActive'] = true;

        $this->source = $source;


        $powerCode['lastSendA'] = false;

        $this->powerCode = $powerCode;

        $this->ir = new \IR();
    }

    function changeSource()
    {

        $next = array_filter($this->source,function ($el){
            return $el['nextActive'] == true;
        });

        $index = array_find($next,$this->source);

        $code = $next['lastSendA'] ? $next['b']:$next['a'];

        $next['lastSendA'] = !$next['lastSendA'];

        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5)));



    }

    function on()
    {
        echo "Beamer on \n";

        $code = $this->powerCode['lastSendA'] ? $this->powerCode['b']:$this->powerCode['a'];

        $this->powerCode['lastSendA'] = !$this->powerCode['lastSendA'];

        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5)));

        return $r;

    }

    function off()
    {
        echo "Beamer off\n";

        return $this->on();
    }


}