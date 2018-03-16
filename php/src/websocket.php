<?php

use Mediatrix\MyIoServer;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Mediatrix\Application;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/../vendor/autoload.php';

  $mixer = new \Mediatrix\Mixer('10.20.255.100');

  $server = MyIoServer::factory(
      new HttpServer(
          new WsServer(
              new Application($mixer)
          )
      ),
        10000,
      '0.0.0.0',
      $mixer
  );

  $server->run();