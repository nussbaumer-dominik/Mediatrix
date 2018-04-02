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
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;


class Application implements MessageComponentInterface
{

    private $FILE = "../conf/Mediatrix.json";

    private $client;
    private $scheinwerfer;
    private $beamer;
    private $key;
    private $defaultPresets;
    private $registerd;
    private $av;
    protected $mixer;

    public function __construct($mixer)
    {
        $this->mixer = $mixer;
        $this->iniMe();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later

        //check if there is already a connection
        if (!isset($this->client)) {
            $this->client = $conn;
            $this->registerd = false;

            echo "New connection! ({$conn->resourceId})\n";


        } else {
            $conn->send("Already a connection");
            $conn->close();

            echo "Connection denied! ({$conn->resourceId})\n";
        }
    }

    /**
     * @param ConnectionInterface $from
     * @param string $msg
     */
    public function onMessage(ConnectionInterface $from, $msg)
    {
        echo "Got Message: {$msg} from: {$from->resourceId}\n";

        try {

            //init return array
            $result = array();
            array_push($result, json_decode('{"success":"true","err":""}'));


            //decode command json
            $commands = json_decode($msg, true);


            //Check JWT
            $jwt = $commands['jwt'];

            if(!preg_match('/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/',$jwt)) {

                $from->send(json_encode($this->addLiveStatus(array('success' => false, 'err' => 'no valid JWT passed'))));

            }

            $jwt = JWT::decode($jwt, $this->key, array("HS256"));



            //handle registration and send ini string
            if (isset($commands["ini"])) {
                $from->send(json_encode($this->addLiveStatus($this->getIniString($jwt->data->userName))));
                $this->registerd = true;
                echo "Connection {$from->resourceId} registered, Ini-String sent\n";
                return;
            }


            //check if user has registered
            if ($this->registerd) {


                /*
                 * DMX:
                 */
                if (isset($commands["dmx"])) {


                    $r = $this->sendDmx($commands["dmx"]);
                    $r->success ?: array_push($result, $r);

                }

                /*
                 * Mikrofone
                 */
                if(isset($commands['mixer'])) {

                    foreach ($commands['mixer']['mikrofone'] as $val){

                        if(!(is_null($this->mikrofone[$val['id']])) && is_float($val['value']) && $val['value'] >= 0 && $val['value'] <= 1){
                            $r = $this->mikrofone[$val['id']]->setVolume($val['value']);
                            $r['success'] ?: array_push($result, $r);
                        }else
                        {
                            array_push($result, array('success' => false,'err' => 'Scheinwerfer id not valid'));
                        }
                    }

                    if(isset($commands['mixer']['master']) && is_float($commands['mixer']['master']) && $commands['mixer']['master'] >= 0 &&
                        $commands['mixer']['master'] <= 1){
                        $r = $this->mixer->setMasterVolume($commands['mixer']['master']);
                        $r['success'] ?: array_push($result, $r);
                    }

                    if(isset($commands['mixer']['line']) && is_float($commands['mixer']['line']) && $commands['mixer']['line'] >= 0 &&
                        $commands['mixer']['line'] <= 1){
                        $r = $this->mixer->setLineVolume($commands['mixer']['line']);
                        $r['success'] ?: array_push($result, $r);
                    }

                }


                /*
                 * Beamer:
                 */
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

                    if (isset($beamerCom['freeze'])) {
                        $r = $this->beamer->freeze();
                        $r->success ?: array_push($result, $r);
                    }

                    if (isset($beamerCom['blackout'])) {
                        $r = $this->beamer->blackout();
                        $r->success ?: array_push($result, $r);
                    }


                }


                /*
                 * AV:
                 */
                if (isset($commands["av"])) {
                    $av = $commands['av'];
                    if (isset($av['mode'])) {

                        if(preg_match('/^[a-zA-Z0-9]+$/',$av['mode']) && isset($this->av->getPresets()[$av['mode']])) {
                            $r = $this->av->setPreset($av['mode']);
                            $r->success ?: array_push($result, $r);
                        }else{
                            array_push($result, array("success" => false, "err" => "Mode of Av-Receiver does not exist"));
                        }
                    }
                    if (isset($av['source'])) {
                        $r = $this->av->changeSource();
                        $r->success ?: array_push($result, $r);
                    }
                    if (isset($av['volume'])) {

                        if(preg_match("/-?[0-9]+/",$av['volume']) && $this->av->getMinVolume() <= $av['volume'] && $av['volume'] <= $this->av->getMaxVolume()) {

                            $r = $this->av->setVolumeLevel($av['volume']);
                            $r->success ?: array_push($result, $r);
                        }else{
                            array_push($result, array("success" => false, "err" => "Volume-Level must be valid"));
                        }
                    }
                }


                /*
                 * No Command recognized
                 * TODO
                 */
                if (!(isset($commands["dmx"]) || isset($commands["beamer"]) || isset($commands["av"]) || isset($commands["mixer"]))) {
                    $from->send(json_encode($this->addLiveStatus(array("success" => false, "err" => "Unrecognized Command"))));
                }


                //check if an error was added to the return array
                if (count($result) > 1) {

                    array_shift($result);

                    //send each error to the client
                    foreach ($result as $r) {
                        $from->send(json_encode($this->addLiveStatus($r)));
                    }
                }else{

                    $from->send(json_encode($this->addLiveStatus(array('success' => true, 'err' => ''))));

                }


            } else {
                //User has not registered

                $from->send(json_encode($this->addLiveStatus(array("success" => false, "err" => "Not registered"))));
                echo "{$from->resourceId} send a message but was not registered\n";
            }


        } catch (ExpiredException $ex) {
            //Session Expired send error message

            $from->send(json_encode($this->addLiveStatus(array("success" => false, "err" => "Session Expired"))));
            $from->close();

            echo 'Session expired: ' . $ex->getMessage() . "\n";


        } catch (\Exception $ex) {
            //Any error occurred

            $from->send(json_encode($this->addLiveStatus(array("success" => false, "err" => "There was an Error"))));
            echo 'There was an Error: ' . $ex->getMessage() . ' ' . $ex->getFile() . ' ' . $ex->getLine() . "\n";
        }

    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->registerd = false;

        // The connection is closed, remove it, as we can no longer send it messages
        $this->client = null;

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

    /**
     * @param array $dmx
     * @return array Result-Array
     */
    private function sendDmx(array $dmx)
    {
        $result = array();
        array_push($result, (object) array("success" => true, "err" => ""));


        if (isset($dmx["blackout"])) {
            foreach ($this->scheinwerfer as $dev) {
                $r = $dev->off();

                if (!$r->success) {
                    array_push($result, $r);
                }
            }

            unset($dmx["blackout"]);
        }

        if (isset($dmx["noblackout"])) {
            foreach ($this->scheinwerfer as $dev) {
                $r = $dev->on();

                if (!$r->success) {
                    array_push($result, $r);
                }
            }

            unset($dmx["noblackout"]);
        }

        foreach ($dmx as $dev) {

            //check if Scheinwerfer id is valid
            if (is_array($dev) && !(is_null($this->scheinwerfer[$dev['id']]))) {

                //check if scheinwerfer has less than 3 channels
                if(count($dev)-1 < 3 && count($this->scheinwerfer[$dev['id']]->getChannels()) < 3) {

                    if (preg_match('/[0-9]+/', $dev['hue']) && 0 <= $dev['hue'] && $dev['hue'] <= 255) {

                        $r = $this->scheinwerfer[$dev["id"]]->dimmen($dev["hue"]);

                        if (!$r->success) {
                            array_push($result, $r);
                        }
                    }

                }else if (count($this->scheinwerfer[$dev['id']]->getChannels()) == count($dev)-1){

                    if(preg_match('/[0-9]+/', $dev['r']) && 0 <= $dev['r'] && $dev['r'] <= 255 &&
                        preg_match('/[0-9]+/', $dev['g']) && 0 <= $dev['g'] && $dev['g'] <= 255 &&
                        preg_match('/[0-9]+/', $dev['b']) && 0 <= $dev['b'] && $dev['b'] <= 255) {

                        $send = $dev;
                        unset($send['id']);

                        $r = $this->scheinwerfer[$dev["id"]]->dimmen($send);

                        if (!$r->success) {
                            array_push($result, $r);
                        }
                    }
                }else{
                    array_push($result, (object) array('success' => false,'err' => 'Wrong number of channels'));
                }

            }else
            {
                array_push($result, (object) array('success' => false,'err' => 'Scheinwerfer id not valid'));
            }
        }

        /*if(isset($dmx['r']) && isset($dmx['g']) && isset($dmx['b'])){

            $data = array(
                "r" => $dmx['r'],
                "g" => $dmx['g'],
                "b" => $dmx['b'],
            );

            if(isset($dmx['w'])) {
                $data["w"] = $dmx['w'];
            }

            if(!isset($dmx['hue'])){
                $dmx['hue'] = 255;
            }

            foreach ($this->scheinwerfer as $scheinw) {
                $x = count($scheinw->getChannels());
                if ($x > 3){
                    $r = $scheinw->dimmen(
                        $data
                    );
                }elseif ($x == 1) {
                    $r = $scheinw->dimmen($dmx['hue']);
                }

                if (!$r->success) {
                    array_push($result, $r);
                }
            }

        }elseif(isset($dmx['hue'])){
            foreach ($this->scheinwerfer as $scheinw) {
                    $r = $this->scheinwerfer[$dev["id"]]->dimmen($dmx['hue']);

                if (!$r->success) {
                    array_push($result, $r);
                }
            }
        }*/

        if (count($result) > 1) {
            return $result[1];
        }
        return $result[0];
    }

    /**
     * @param $usr
     * @return array
     */
    private function getIniString($usr)
    {

        /*
         * PRESETS:
         */

        $presets = array();

        $sqlite = new \SQLite3("../sqlite/db.sqlite");

        $stm = $sqlite->prepare('SELECT * FROM preset WHERE user_id = :id');
        $stm->bindParam(':id', $usr);

        $result = $stm->execute();

        $hasResults = false;

        while ($res = $result->fetchArray(SQLITE3_ASSOC)) {
            $hasResults = true;
            array_push($presets, array('name' => $res['name'], 'conf' => $res['json']));
        }

        $presets = $hasResults? $presets:$this->defaultPresets;

        //escape Characters
        foreach ($presets as $key => $value){
            unset($presets[$key]);

            $key = htmlentities($key);

            $presets[$key] = $value;
        }

        /*
         * Extended
         */
        $isExtended = null;

        $sqlite = new \SQLite3("../sqlite/db.sqlite");

        $stm = $sqlite->prepare('SELECT isextendet FROM user WHERE id = :id');
        $stm->bindParam(':id', $usr);

        $result = $stm->execute();

        while ($res = $result->fetchArray(SQLITE3_ASSOC)) {
            $isExtended = boolval($res['isextendet']);
        }

        $presets = $hasResults? $presets:$this->defaultPresets;



        /*
         * DMX:
         */
        $dmx = array();

        foreach ($this->scheinwerfer as $key => $dev) {


            $dmx["scheinwerfer{$key}"] = array(
                "id" => $key,
                "numberChannels" => count($dev->getChannels())
            );

        }


        /*
         * BEAMER:
         */

        /*
         * AV:
         */
        $av = array();

        $av['presets'] = array_keys($this->av->getPresets());

        $av['maxVolume'] = $this->av->getMaxVolume();

        $av['minVolume'] = $this->av->getMinVolume();

        /*
         * Mikrofon
         */
        $mikrofone = array_keys($this->mikrofone);


        return array("ini" => array(
            "presets" => $presets,
            "dmx" => $dmx,
            "av" => $av,
            "isExtended" => $isExtended,
            "mixer" => $mikrofone
        ));
    }


    private function addLiveStatus($result)
    {

        $result = (array) $result;

        $result['live'] = array(
            'av' => array(
                'volume' => $this->av->getVolumeLevel(),
                'source' => $this->av->getSource()
            )
        );

        $live['dmx'] = array();

        foreach ($this->scheinwerfer as $key =>$scheinw){
            $channels = $scheinw->getStatus();
            $help = array('id' => $key, 'channels' => $channels);
            array_push($live['dmx'],$help);
        }

        $live['beamer'] = array('on' => $this->beamer->isOn());


        $result['live'] = $live;

        foreach ($this->clients as $client){
            $client->send(json_encode(array('live' => $live)));
        }

        return $result;
    }

    private function iniMe()
    {

        try {


            //open Ini JSON-File
            $ini = file_get_contents($this->FILE, true);
            $ini = json_decode($ini, true);

            //get Key form Key-class and set it
            $this->key = base64_decode(Key::getKey());

            //set default mPResets
            $this->defaultPresets = $ini['defaultPresets'];

            /*
             * DMX:
             */
            $scheinwerfer = array();

            foreach ($ini["dmx"] as $entry) {

                if (isset($entry["rot"])) {

                    if (count($entry) == 4) {

                        if(isset($entry['weiss'])) {
                            array_push($scheinwerfer,
                                new RGBWScheinwerfer(array(
                                        "r" => $entry["rot"] - 1,
                                        "g" => $entry["gruen"] - 1,
                                        "b" => $entry["blau"] - 1,
                                        "w" => $entry["weiss"] - 1
                                    )
                                )
                            );

                        }elseif(isset($entry['hue'])) {
                            array_push($scheinwerfer,
                                new RGBWScheinwerfer(array(
                                        "r" => $entry["rot"] - 1,
                                        "g" => $entry["gruen"] - 1,
                                        "b" => $entry["blau"] - 1,
                                        "hue" => $entry["hue"] - 1
                                    )
                                )
                            );
                        }

                    }else if(count($entry) == 3) {

                        array_push($scheinwerfer,
                            new RGBWScheinwerfer(array(
                                    "r" => $entry["rot"] - 1,
                                    "g" => $entry["gruen"] - 1,
                                    "b" => $entry["blau"] - 1
                                )
                            )
                        );
                    }elseif (count($entry) == 5){

                        array_push($scheinwerfer,
                            new RGBWScheinwerfer(array(
                                    "r" => $entry["rot"] - 1,
                                    "g" => $entry["gruen"] - 1,
                                    "b" => $entry["blau"] - 1,
                                    "w" => $entry["weiss"] - 1,
                                    "hue" => $entry["hue"] - 1
                                )
                            )
                        );
                    }

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

            /*
             * Mikrofon
             */
            $mikrofone = array();

            foreach ($ini['mixer']['mikrofon'] as $key => $mic){
                $mikrofone[$key] =new Mikrofon($this->mixer,$mic['channel']);
            }

            $this->mikrofone = $mikrofone;

            /*
             * BEAMER:
             */
            $this->beamer = new Beamer($ini['beamer']['source'], $ini['beamer']['power'],$ini['beamer']['freeze'],$ini['beamer']['blackout'],$ini['beamer']['gpio']);


            /*
             * AV:
             */
            $av = $ini['av'];

            $this->av = new AV($av['sources'], $av['volume'], $av['presets'], $av['dbPerClick'], $av['maxVolume'], $av['minVolume'], $av['gpio'], $av['power'],$av['iniVolume']);


        } catch (\Exception $ex) {
            echo $ex->getMessage();
            throw new \Exception("Error open and parsing ini-Json");
        }


    }

}
