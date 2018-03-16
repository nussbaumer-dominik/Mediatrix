<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 06.03.2018
 * Time: 15:01
 */

namespace Mediatrix;
use Ratchet\MessageComponentInterface;
use React\EventLoop\Factory as LoopFactory;
use React\Socket\Server as Reactor;


class MyIoServer extends \Ratchet\Server\IoServer
{
    /**
     * @param  \Ratchet\MessageComponentInterface $component The application that I/O will call when events are received
     * @param  int $port The port to server sockets on
     * @param Mixer $mixer
     * @param  string $address The address to receive sockets on (0.0.0.0 means receive connections from any)
     * @return MyIoServer
     */
    public static function factory(MessageComponentInterface $component, $port = 80,$address = '0.0.0.0', Mixer $mixer = null) {
        $loop   = LoopFactory::create();

        $loop->addPeriodicTimer(10, function() use (&$mixer) {
            $mixer->alive();
        });

        $socket = new Reactor($address . ':' . $port, $loop);

        return new static($component, $socket, $loop);
    }

}