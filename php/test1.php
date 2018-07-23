<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 23.07.2018
 * Time: 13:51
 */

var_dump($GLOBALS);

$i = 0;

while($i < 10){
    $i++;
    sleep(3);
    var_dump($GLOBALS);
}