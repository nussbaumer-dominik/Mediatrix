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

        //print_r(array_search(true, array_column($this->source, 'lastUsed')));
        echo "Beamer changed Source \n";
        return true;

    }

    function on()
    {
        echo "Beamer on \n";

        var_dump($this->powerCode);

        $code = $this->powerCode['lastSendA'] ? $this->powerCode['b']:$this->powerCode['a'];

        $this->powerCode['lastSendA'] = !$this->powerCode['lastSendA'];

        return $this->ir->send($code,5);
    }

    function off()
    {
        echo "Beamer off\n";

        return $this->on();
    }


}