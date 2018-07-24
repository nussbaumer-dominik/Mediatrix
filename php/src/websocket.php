<?php

use Mediatrix\MyIoServer;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Mediatrix\Application;
use Ratchet\WebSocket\WsServer;
use WebSocket\Client;

require __DIR__ . '/../vendor/autoload.php';

    //$GLOBALS['mixer'] =

    var_dump($GLOBALS);
    /*
    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new Application($GLOBALS['mixer'])
            )
        ),
            10000,
        '0.0.0.0'
    );

    $server->run();
