<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 19.11.2017
 * Time: 21:00
 */

namespace Mediatrix;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;


class Application implements  MessageComponentInterface {
    protected $client;
    protected $scheinwerfer;
    protected $ini;

    public function __construct() {
        $this->ini = new Ini($this);
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        if(!isset($this->client)) {
            $this->client = $conn;

            echo "New connection! ({$conn->resourceId})\n";
        }else{
            $conn->send("Already a connection");
            $conn->close();

            echo "Connection denied! ({$conn->resourceId})\n";
        }
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Got Massage: {$msg} from: {$from->resourceId}\n";

        $commands = json_decode($msg, true);

        if(isset($commands["dmx"])){
            $this->sendDmx($commands["dmx"]);
        }elseif (isset($commands["beamer"])){
            $from->send("beamer");
        }elseif (isset($commands["av"])){
            $from->send("av");
        }else{
            $from->send("Unrecognized Command");
        }


    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->client = null;

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

    /**
     * @param array $scheinwerfer
     */
    public function setScheinwerfer(array $scheinwerfer)
    {
        $this->scheinwerfer = $scheinwerfer;
    }

    /**
     * @param array $dmx
     */
    private function sendDmx(array $dmx)
    {
        foreach($dmx as $dev){
            echo "sendDmx: ".(json_encode($dev));
            $this->scheinwerfer[$dev["id"]]->dimmen($dev["hue"]);
        }
    }


}