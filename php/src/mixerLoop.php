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

$mixer = new \Mediatrix\Mixer('192.168.1.100');
//$mixer = new \Mediatrix\Mixer('10.0.0.53');
//$mixer = null;

$GLOBALS['mixer'] = 2;

/*
var_dump($GLOBALS['mixer']);

$loop = LoopFactory::create();

$loop->addPeriodicTimer(1, function() {
    if(isset($GLOBALS['mixer']) && !is_null($GLOBALS['mixer'])) {
        $GLOBALS['mixer']->alive();
    }
});

$loop->run();
*/