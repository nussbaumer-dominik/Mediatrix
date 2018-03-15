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
    private $freeze = array();
    private $blackout = array();

    public function __construct(array $source, array $powerCode, array $freeze, array $blackout)
    {
        foreach ($source as $k => $s){
            $source[$k]['nextActive'] = false;
            $source[$k]['lastSendA'] = false;
        }

        $source[0]['nextActive'] = true;

        $this->source = $source;


        $powerCode['lastSendA'] = false;

        $this->powerCode = $powerCode;


        $freeze['lastSendA'] = false;

        $this->freeze = $freeze;


        $blackout['lastSendA'] = false;

        $this->blackout = $blackout;


        $this->ir = new \IR();
    }

    function changeSource()
    {
        echo "change Source \n";

        var_dump($this->source);

        //get next active Source
        $next = array_pop(array_filter($this->source,function ($el){
            return $el['nextActive'] == true;
        }));

        var_dump($next);

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

    function freeze(){
        echo "Beamer freeze \n";

        //get Code
        $code = $this->freeze['lastSendA'] ? $this->freeze['b']:$this->freeze['a'];

        $this->freeze['lastSendA'] = !$this->freeze['lastSendA'];

        //send IR code
        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5)));

        //return Result
        return $r;
    }

    function blackout(){
        echo "Beamer freeze \n";

        //get Code
        $code = $this->blackout['lastSendA'] ? $this->blackout['b']:$this->blackout['a'];

        $this->blackout['lastSendA'] = !$this->blackout['lastSendA'];

        //send IR code
        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5)));

        //return Result
        return $r;
    }


}