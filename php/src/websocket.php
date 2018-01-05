<?php

use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Mediatrix\Application;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/../vendor/autoload.php';

    $ws = new WsServer(
        new Application()
    );

    $ws->enableKeepAlive(new \React\EventLoop\StreamSelectLoop());

  $server = IoServer::factory(
      new HttpServer(
          $ws
      ),
        10000
  );

  $server->run();
