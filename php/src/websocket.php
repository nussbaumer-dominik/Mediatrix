<?php


use Mediatrix\MyIoServer;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Mediatrix\Application;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/../vendor/autoload.php';

  $server = MyIoServer::factory(
      new HttpServer(
          new WsServer(
              new Application()
          )
      ),
        10000
  );

  $server->run();