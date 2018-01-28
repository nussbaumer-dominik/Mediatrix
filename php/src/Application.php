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
use function Sodium\add;


class Application implements  MessageComponentInterface {

    private $FILE = "../conf/Mediatrix.json";

    private $client;
    private $scheinwerfer;
    private $beamer;
    private $key;
    private $defaultPresets = '{
            "0": {
                "name":"",
                
            }
        }';
    private $registerd;

    public function __construct() {
        $this->iniMe();
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later

        //check if there is already a connection
        if(!isset($this->client)) {
            $this->client = $conn;
            $this->registerd = false;

            echo "New connection! ({$conn->resourceId})\n";


        }else{
            $conn->send("Already a connection");
            $conn->close();

            echo "Connection denied! ({$conn->resourceId})\n";
        }
    }

    /**
     * @param ConnectionInterface $from
     * @param string $msg
     */
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

            $jwt = JWT::decode($jwt,$this->key, array("HS256"));

            //handle registration and send ini string
            if(isset($commands["ini"])){
                $from->send(json_encode($this->addLiveStatus($this->getIniString($jwt->data->userName))));
                $this->registerd = true;
                echo "Connection {$from->resourceId} registered, Ini-String sent\n";
                return;
            }

            //check if user has registered
            if($this->registerd) {
                //check if dmx command was passed
                if (isset($commands["dmx"])) {

                    $r = $this->sendDmx($commands["dmx"]);
                    $r['success'] ?: array_push($result, $r);

                    //check if beamer command was passed
                }
                if (isset($commands["beamer"])) {
                    $beamerCom = $commands["beamer"];

                    if (isset($beamerCom['on'])) {
                        $r = $this->beamer->on();
                        $r->success ?: array_push($result, $r);
                    }

                    if (isset($beamerCom['off'])) {
                        $r = $this->beamer->off();
                        $r->success ?: array_push($result, $r);
                    }

                    if (isset($beamerCom['source'])) {
                        $r = $this->beamer->changeSource();
                        $r->success ?: array_push($result, $r);
                    }

                    //check if av command was passed
                }
                if (isset($commands["av"])) {
                    $from->send("av");

                    //if nothing from  was right, no command recognized
                }

                if (!(isset($commands["dmx"]) || isset($commands["beamer"]) || isset($commands["av"]))) {
                    $from->send(json_encode($this->addLiveStatus(array("success" => false, "err" => "Unrecognized Command"))));
                }

                //check if an error was added to the return array
                if (count($result) > 1) {

                    array_shift($result);

                    //send each error to the client
                    foreach ($result as $r) {
                        $from->send(json_encode($this->addLiveStatus($r)));
                    }
                }
            }else{
                $from->send(json_encode($this->addLiveStatus(array("success"=>false, "err"=>"Not registered"))));
                echo "{$from->resourceId} send a message but was not registered\n";
            }

        //If Session Expired send error message
        }catch(ExpiredException $ex){
            $from->send(json_encode($this->addLiveStatus(array("success"=>false, "err"=>"Session Expired"))));
            $from->close();

            echo 'Session expired: '.$ex->getMessage()."\n";
        }catch (\Exception $ex){
            $from->send(json_encode($this->addLiveStatus(array("success"=>false, "err"=>"There was an Error"))));
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

    private function getIniString($usr){

        /*
         * PRESETS:
         */
        $sqlite = new \SQLite3("../sqlite/db.sqlite");

        $stm = $sqlite->prepare('SLECT * FROM preset WHERE user_id = :id');
        $stm->bindValue(':id',$usr);

        $result = $stm->execute();

        //check if there was data in the database
        if($result->numColumns() > 0){
            $presets = array();
            while($res = $result->fetchArray()){
                array_push($presets, $res['json']);
            }

        }else{

            $presets = $this->defaultPresets;

        }


        /*
         * DMX:
         */


        /*
         * BEAMER:
         */

        /*
         * AV:
         */


        return array(
                "presets" => $presets,
                "dmx" => array(

                    ),
                ""
            );
    }


    private function addLiveStatus($result){


        return $result;
    }

    private function iniMe(){

        try {
            $ini = file_get_contents($this->FILE, true);
            $ini = json_decode($ini, true);

            $this->key = base64_decode(Key::getKey());

            $scheinwerfer = array();

            foreach($ini["dmx"] as $entry){

                if(isset($entry["rot"])){

                    array_push($scheinwerfer,
                        new RGBWScheinwerfer(array(
                                "r" => $entry["rot"] - 1,
                                "g" => $entry["rot"] - 1,
                                "b" => $entry["rot"] - 1,
                                "w" => $entry["weiss"] - 1
                            )
                        )
                    );

                }else {

                    array_push($scheinwerfer,
                        new Scheinwerfer(array(
                                "hue" => $entry["hue"] - 1
                            )
                        )
                    );
                }

            }

            $this->scheinwerfer = $scheinwerfer;

            $this->beamer = new Beamer($ini['beamer']['source'],$ini['beamer']['power']);



        }catch (\Exception $ex){
            echo $ex->getMessage();
            throw new \Exception("Error open and parsing ini-Json");
        }


    }

}