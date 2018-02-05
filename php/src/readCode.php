<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 01.02.2018
 * Time: 20:31
 */

echo "Reading IR-Code";

$ir = new \IR();

echo "Modes:\n";

echo $ir->getMode();

$mode =  readline("Which Mode: ");

$codes = $ir->read($mode);

echo $codes;