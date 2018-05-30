<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 15.05.2018
 * Time: 12:57
 */
use Mediatrix\Beamer;

if(isset($GLOBALS['beamer'])){
    $beamer = $GLOBALS['beamer'];



    if(!$beamer->isOn()){
        $beamer->off();
    }
}