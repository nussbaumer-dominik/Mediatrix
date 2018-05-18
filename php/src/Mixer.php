<?php
namespace Mediatrix;
use WebSocket\Client;

class Mixer {

	//Variablen
	protected $session_id;
	protected $mixer;
	protected $count = 1;
	protected $lastVolume = 0.0;
	protected $command = "3:::SETD^i.";

	//Konstruktor
	public function __construct(string $ipAddress) {
		$erg = $this->connectToScui($ipAddress);
		if(!$erg['success']){
		    throw new \Exception('Connection to Mixer impossible');
        }
		echo $ipAddress;
	}

	//Verbindung mit Mischpult herstellen
	public function connectToScui($ipAddress) {
		echo "connectToScui";
		$url = $ipAddress . "/socket.io/";
		$req = curl_init();
		curl_setopt($req, CURLOPT_URL, $url);
		curl_setopt($req, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($req, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($req, CURLOPT_AUTOREFERER, TRUE);
		curl_setopt($req, CURLOPT_CONNECTTIMEOUT, 400);
        curl_setopt($req, CURLOPT_TIMEOUT, 400);
		$result = curl_exec($req);

		$session_id = substr($result, 0, 20);


		echo "Session_Id: ". $session_id . " ";
		curl_close ($req);

		try {
			if($session_id == ""){
                throw new \Exception('Connection to Mixer impossible');
            }

		    echo($this->mixer);
			$this->mixer = new Client("ws://" . $ipAddress . "/socket.io/1/websocket/" . $session_id);

			return array("success" => true, "err" => "");
		} catch (\Exception $ex){
			return array("success" => false, "err" => $ex);
			echo "Error beim Verbindungsaufbau " . $ex;
		}
	}

	//Mute Befehl erstellen
	public function mute($mute, $channel) {
		echo $mute . "\n";
		try {
			echo "im Try Block der Mute-Funktion gelandet \n";
			echo "Der Mute Wert ist: " . $mute . " und der Kanal: " . $channel . "\n";
			$this->mixer->send($this->command . $channel . ".mute^" . $mute);
			return array("success" => true, "err" => "");
		} catch(Exception $ex) {
			return array("success" => false, "err" => $ex);
			echo "Error beim muten " . $ex;
		}
	}

	//Lautstärke regeln
	public function mix($val, $channel) {
		try {
			echo "im Try Block der mix-Funktion gelandet \n"; 
			echo "die Lautstärke ist: " . $val . " und der Channel: " . $channel . "\n";
			$this->mixer->send($this->command . $channel . ".mix^" . $val);
			echo "success";
			if($channel == "0"){
				$this->lastVolume = $val;
			}
			return array("success" => true, "err" => "");
		} catch(Exception $ex) {
			return array("success" => false, "err" => $ex);
			echo "stellen der Lautstärke fehlgeschlagen - Fehlermeldung: " . $ex;
		}
	}

	public function alive() {
		try {
			//echo "Alive " . "2::\n";
			//$this->mixer->send("2::");
			//$this->mixer->send("3:::SETD^i.0.mix^" . $this->lastVolume);
			//echo "3:::SETD^i.0.mix^" . $this->lastVolume. "\n";
			//if($this->count % 10 == 1){
				//echo "3:::ALIVE\n";
				$this->mixer->send("3:::ALIVE");
			//}
			$this->count++;
			return array("success" => true, "err" => "");
		} catch(Exception $ex) {
			return array("success" => false, "err" => $ex);
			echo "Alive fehlgeschlagen - Fehlermeldung: " . $ex;
		}
	}

	public function setLineVolume($val) {
		echo $val . "";
		try {
			$this->mixer->send("3:::SETD^l.0.mix^" . $val);
			$this->mixer->send("3:::SETD^l.1.mix^" . $val);
			return array("success" => true, "err" => "");
		} catch(Exception $ex) {
			return array("success" => false, "err" => $ex);
		}
	}

	public function setMasterVolume($val) {
		echo $val . "";
		try {
			$this->mixer->send("3:::SETD^m.mix^" . $val);
			return array("success" => true, "err" => "");
		} catch(Exception $ex) {
			return array("success" => false, "err" => $ex);
		}
	}
}
