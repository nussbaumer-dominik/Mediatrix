<?php

//phpinfo();

$channel = $_GET["data"];

$dmx = new DMX();

$erg = array(0 => 255);

print_r($_GET);


foreach ($channel as $entry) {
  print_r($entry);
  $erg[$entry["channel"]] = $entry["value"];
}

print_r($erg);

$dmx::sendChannel($erg);

echo "finished";
