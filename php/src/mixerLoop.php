<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 12.05.2018
 * Time: 23:13
 */

use React\EventLoop\Factory as LoopFactory;
use Mediatrix\Mixer;

require __DIR__ . '/../vendor/autoload.php';

$loop = LoopFactory::create();

$loop->addPeriodicTimer(1, function() {
    if(!( isset($GLOBALS['mixer']) || is_null($GLOBALS['mixer']))) {
        $GLOBALS['mixer']->alive();
    }
    echo "Test";
});

$loop->run();