<?php

print("<pre>");

//ep4M@HTL3r17

$mbox = imap_open("{scharwitzl.com:993/imap/ssl/novalidate-cert}INBOX", "mediatrix@scharwitzl.com", "ep4M@HTL3r17");

//$result = imap_search($mbox, 'UNSEEN');

$result =  [4];

print_r($result);
print_r(imap_fetchstructure($mbox,1));

print("</pre>");

foreach($result as $id){
  echo $id.': ';
   //print_r($message = imap_fetchtext($mbox,$id));
   echo imap_fetchbody($mbox,$id, 1);
}

imap_close($mbox);
