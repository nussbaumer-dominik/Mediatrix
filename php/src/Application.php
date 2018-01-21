<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 19.11.2017
 * Time: 21:00
 */

namespace Mediatrix;

use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\SignatureInvalidException;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;


class Application implements  MessageComponentInterface {

    private $FILE = "Mediatrix.json";

    private $client;
    private $scheinwerfer;
    private $beamer;
    private $key;

    public function __construct() {
        $this->iniMe();
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later

        //check if there is already a connection
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

            //init return array
            $result = array();
            array_push($result, json_decode('{"success":"true","err":""}'));

            //decode command json
            $commands = json_decode($msg, true);

            //Check JWT
            $jwt = $commands['jwt'];

            JWT::decode($jwt,$this->key, array("HS256"));

            //check if dmx command was passed
            if(isset($commands["dmx"])){

                $r = $this->sendDmx($commands["dmx"]);

                print_r((bool)$r['success']);
                (bool)$r['success']?:array_push($result,$r);

            //check if beamer command was passed
            }
            if (isset($commands["beamer"])){
                $beamerCom = $commands["beamer"];

                if(isset($beamerCom['on'])){
                    $r = $this->beamer->on();
                    echo "TEs: ";
                    print_r($r->success);
                    (bool)$r->success?:array_push($result,$r);
                }

                if (isset($beamerCom['off'])){
                    $r = $this->beamer->off();
                    (bool)$r->success?:array_push($result,$r);
                }

                if (isset($beamerCom['source'])){
                    $r = $this->beamer->changeSource();
                    (bool)$r->success?:array_push($result,$r);
                }

            //check if av command was passed
            }
            if (isset($commands["av"])){
                $from->send("av");

            //if nothing from  was right, no command recognized
            }

            if(!(isset($commands["dmx"]) || isset($commands["beamer"]) || isset($commands["av"]))){
                $from->send('{"success":"false","err":"Unrecognized Command"}');
            }

            //check if an error was added to the return array
            if(count($result)>1){

                array_shift($result);

                //send each error to the client
                foreach ($result as $r){
                    $from->send(json_encode($r));
                }
            }

        //If Session Expired send error message
        }catch(ExpiredException $ex){
            $from->send('{"success":"false","err":"Session Expired"}');
            $from->close();

            echo 'Session expired: '.$ex->getMessage()."\n";
        }catch (\Exception $ex){
            $from->send('{"success":"false","err":"There was an Error"}');
            echo 'There was an Error: '.$ex->getMessage().' '.$ex->getFile().' '.$ex->getLine()."\n";
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
     * @return array Result-Array
     */
    private function sendDmx(array $dmx)
    {
        $result = array();
        array_push($result,array("success"=>true,"err"=>""));

        foreach($dmx as $dev){

            if(is_array($dev)) {
                $r = $this->scheinwerfer[$dev["id"]]->dimmen($dev["hue"]);

                if(!$r->success){
                    array_push($result,$r);
                }
            }
        }

        if(count($result)>1){
            return $result[1];
        }
        return $result[0];
    }

    public function iniMe(){

        try {
            $ini = file_get_contents($this->FILE, true);
            $ini = json_decode($ini, true);

            $this->key = base64_decode(Key::getKey());

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



        }catch (\Exception $ex){
            echo $ex->getMessage();
            throw new \Exception("Error open and parsing ini-Json");
        }


    }

}