<?php
namespace Mediatrix;

require __DIR__ . '/../vendor/autoload.php';

use WebSocket\Client;

class Mixer {

	//Variablen
	protected $session_id;
	protected $mixer;
	protected $command = "3:::SETD^i.";
	protected $alive = "3:::ALIVE";
	protected $conn;

	//Konstruktor
	public function __construct(string $ipAddress) {
		$this->connectToScui($ipAddress);
	}

	//Verbindung mit Mischpult herstellen
	public function connectToScui($ipAddress) {
		/*$url = $ipAddress . "/socket.io";
		$req = curl_init();
		curl_setopt($req, CURLOPT_URL, $this->$url);
		curl_setopt($req, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($req, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($req, CURLOPT_AUTOREFERER, TRUE);
		$result = curl_exec($req);

		$session_id = substr($result, 0, 20);

		echo $result;
		curl_close ($req);*/

		try {
			$client = new Client("ws://" . $ipAddress . "/socket.io/1/websocket/" . $session_id);
			$client->send("Hallo");

			echo $client->receive(); 
		}catch (Exception $ex){
			return array("success" => false, "err" => $ex);
			echo "Error";
		}

		$this->conn->send("TEST");
	}

	//Mute Befehl erstellen
	public function mute($mute, $channel) {
	$command = $command . $channel . "mute" . $mute;
	//$this->conn->send($command);
	}

	//Lautstärke regeln
	public function mix($val, $channel) {
	$command = $command . $channel . "mix^" . $val;
	//$this->conn->send($command);
	}

	public function alive() {
	echo "Alive\n";
	//$this->send($alive);
	}

	public function setLineVolume($val) {
	$commandl = "3:::SETD^l.0.mix^" . $val;
	$commandr = "3:::SETD^l.1.mix^" . $val;
	//$this->conn->send($commandl);
	//$this->conn->send($commandr);
	}

	public function setMasterVolume($val) {
	$command = "3:::SETD^m.mix^" . $val;
	//$this->conn->send($command);
	}
}
