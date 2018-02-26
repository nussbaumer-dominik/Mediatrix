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

$modes = $ir->getMode();

if(!strlen($modes) > 0){
    echo "IR-Device is bussy. again later, or disconnect and reconnect the device.\n";
    return;
}

$readMode =  readline("Which Mode: ");

$code = $ir->read($readMode);

while(strlen($codes) < 0){
    readline("No code found. Press Enter to try again or Crtl+C to abroad.");
    $codes = $ir->read($readMode);
}

echo $code;