<?php
namespace Mediatrix;
use WebSocket\Client;

class Mixer {

	//Variablen
	protected $session_id;
	protected $mixer;
	protected $command = "3:::SETD^i.";

	//Konstruktor
	public function __construct(string $ipAddress) {
		$this->connectToScui($ipAddress);
		echo $ipAddress;
	}

	//Verbindung mit Mischpult herstellen
	public function connectToScui($ipAddress) {
		$url = $ipAddress . "/socket.io/";
		$req = curl_init();
		curl_setopt($req, CURLOPT_URL, $url);
		curl_setopt($req, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($req, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($req, CURLOPT_AUTOREFERER, TRUE);
		$result = curl_exec($req);

		$session_id = substr($result, 0, 20);

		echo $session_id . " ";
		curl_close ($req);

		try {
			echo($this->mixer);
			$this->mixer = new Client("ws://" . $ipAddress . "/socket.io/1/websocket/" . $session_id);

			echo $this->mixer->receive();
		} catch (Exception $ex){
			return array("success" => false, "err" => $ex);
			echo "Error";
			print "Error";
		}
	}

	//Mute Befehl erstellen
	public function mute($mute, $channel) {
		$this->mixer->send($this->command . $channel . ".mute^" . $mute);
	}

	//Lautstärke regeln
	public function mix($val, $channel) {
		$this->mixer->send($this->command . $channel . ".mix^" . $val);
	}

	public function alive() {
		echo "Alive " . "3:::ALIVE\n";
		$this->mixer->send("3:::ALIVE");
	}

	public function setLineVolume($val) {
		echo $val . " ";
		$this->mixer->send("3:::SETD^l.0.mix^" . $val);
		$this->mixer->send("3:::SETD^l.1.mix^" . $val);
	}

	public function setMasterVolume($val) {
		echo $val . " ";
		$this->mixer->send("3:::SETD^m.mix^" . $val);
	}
}
