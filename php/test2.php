<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 23.07.2018
 * Time: 13:51
 */

$GLOABALS['test'] = "test";
$i = 0;
while($i< 10){
    $i++;
    $GLOABALS['test'] = "test"+$i;
    sleep(3);
}