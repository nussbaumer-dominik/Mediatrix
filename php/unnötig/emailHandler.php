<pre>
<?php
require ("vendor\autoload.php");


use Ddeboer\Imap\Server;
use Ddeboer\Imap\SearchExpression;
use Ddeboer\Imap\Search\State\NewMessage;

$myfile = 'data.json';
$handle = fopen($myfile, 'w+');

$server = new Server(
    "scharwitzl.com", // required
    993,     // defaults to 993
    "/imap/ssl/novalidate-cert"    // defaults to '/imap/ssl/validate-cert'
);

$connection is instance of \Ddeboer\Imap\Connection;
//$connection = $server->authenticate('mediatrix@scharwitzl.com', 'ep4M@HTL3r17');


$mailbox = $connection->getMailbox('INBOX');

$search = new SearchExpression();
$search->addCondition(new NewMessage());

//$messages = $mailbox->getMessages($search);
$messages = $mailbox->getMessages();

$bodies = [];

foreach ($messages as $message) {
    array_push($bodies, $message->getBodyHtml());
}


if(filesize($myfile) > 0){
  $data = fread($handle, filesize($myfile));
}else $data = '{}';

$data = json_decode($data, true);


$data = array_merge($data, $bodies);


$data = json_encode($data, JSON_HEX_QUOT | JSON_HEX_TAG);


fwrite($handle, $data);


fclose($handle);
