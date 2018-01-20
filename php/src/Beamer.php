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
            $source[$k]['lasSendA'] = false;
        }

        $source[0]['nextActive'] = true;

        $this->source = $source;


        $powerCode['lasSendA'] = false;

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

        return true;
    }

    function off()
    {
        echo "Beamer off\n";
        return true;
    }


}