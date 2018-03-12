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
        echo "change Source \n";

        var_dump($this->source);

        //get next active Source
        $next = array_filter($this->source,function ($el){
            return $el['nextActive'] == true;
        })[0];

        $index = array_search($next,$this->source);

        //get code
        $code = $next['lastSendA'] ? $next['b']:$next['a'];

        $this->source[$index]['lastSendA'] = !$this->source[$index]['lastSendA'];

        //send IR code
        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5)));


        //set next active Source
        $this->source[$index]['nextActive'] = false;

        $index + 1 > count($this->source)-1 ? $index = 0 : $index++;

        $this->source[$index]['nextActive'] = true;

        //return Result
        return $r;
    }

    function on()
    {
        echo "Beamer on \n";

        //get Code
        $code = $this->powerCode['lastSendA'] ? $this->powerCode['b']:$this->powerCode['a'];

        $this->powerCode['lastSendA'] = !$this->powerCode['lastSendA'];

        //send IR code
        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5)));

        //return Result
        return $r;

    }

    function off()
    {
        echo "Beamer off\n";

        $erg = $this->on();

        $r = $this->on();
        if(!$r->success){
            $erg = $r;
        }

        return $erg;

    }


}