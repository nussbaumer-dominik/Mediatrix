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

    public function __construct(array $source, array $powerCode)
    {
        print_r($source);
        foreach ($source as $k => $s){
            $source[$k]['nextActive'] = false;
            $source[$k]['lasSendA'] = false;
        }

        $source[0]['nextActive'] = true;

        $this->source = $source;


        $powerCode['lasSendA'] = false;

        $this->powerCode = $powerCode;
    }

    function changeSource()
    {

        //print_r(array_search(true, array_column($this->source, 'lastUsed')));
        print_r($this->source);
        return true;

    }

    function on()
    {
        echo "Beamer on: ";
        print_r($this->powerCode);
        return true;
    }

    function off()
    {
        echo "Beamer off: ";
        print_r($this->powerCode);
        return true;
    }


}