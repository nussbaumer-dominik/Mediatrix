<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 19.11.2017
 * Time: 21:00
 */

namespace Mediatrix;

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;


class Application implements  MessageComponentInterface {
    protected $client;
    protected $scheinwerfer;
    private $FILE = "Mediatrix.json";
    private $beamer;
    private $key;

    public function __construct() {
        $this->iniMe();
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        if(!isset($this->client)) {
            $this->client = $conn;

            echo "New connection! ({$conn->resourceId})\n";

            $conn->send('Ini-String');
        }else{
            $conn->send("Already a connection");
            $conn->close();

            echo "Connection denied! ({$conn->resourceId})\n";
        }
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Got Massage: {$msg} from: {$from->resourceId}\n";

        try{

            echo "1\n";

            $commands = json_decode($msg, true);

            echo "2\n";

            print_r(JWT::decode($commands['jwt'],$this->key, array('HS512')));

            echo "3\n";

            if(isset($commands["dmx"])){
                $this->sendDmx($commands["dmx"]);
            }elseif (isset($commands["beamer"])){
                $beamerCom = $commands["beamer"];

                if(isset($beamerCom['on'])){
                    $this->beamer->on();
                }

                if (isset($beamerCom['off'])){
                    $this->beamer->off();
                }

                if (isset($beamerCom['source'])){
                    $this->beamer->changeSource();
                }

            }elseif (isset($commands["av"])){
                $from->send("av");
            }else{
                $from->send("Unrecognized Command");
            }

        }catch(ExpiredException $ex){
            $from->send('Session Expired');
            $from->close();

            echo 'Session expired: '.$ex->getMessage();
        }catch (\Exception $ex){
            echo 'There was an Error: '-$ex->getMessage();
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
            echo "sendDmx: ".(json_encode($dev))."\n";
            $this->scheinwerfer[$dev["id"]]->dimmen($dev["hue"]);
        }
    }

    public function iniMe(){

        try {
            $ini = file_get_contents($this->FILE, true);
            $ini = json_decode($ini, true);

            $this->key = Key::getKey();

            $scheinwerfer = array();

            foreach($ini["dmx"] as $entry){

                array_push($scheinwerfer,
                    new Scheinwerfer(array(
                            "hue" => $entry["hue"]-1
                        )
                    )
                );

            }

            $this->scheinwerfer = $scheinwerfer;

            $this->beamer = new Beamer($ini['beamer']['source'],$ini['beamer']['power']);



        }catch (Exception $ex){
            echo $ex->getMessage();
            throw new Exception("Error open and parsing ini-Json");
        }


    }

}