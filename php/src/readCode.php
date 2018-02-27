<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 01.02.2018
 * Time: 20:31
 */
namespace Mediatrix;

echo "Reading IR-Code";

class readCode{
    private $ir;

    public function __construct()
    {
        $this->ir = new \IR();
    }

    function modes()
    {
        echo "Modes:\n";

        $modes = $this->ir::getMode();

        if (!strlen($modes) > 0) {
            throw new \Exception("IR-Device is bussy. Try again later, or disconnect and reconnect the device.\n");
        }

        $modesArray = explode("\\", $modes);

        for ($i = 1; $i <= count($modesArray); $i++) {
            printf("%d.......%s\n", $i, $modesArray[$i - 1]);
        }

        $readMode = readline("Which Mode: ");

        return $readMode;

    }

    function read($readMode)
    {
        $code = $this->ir::read($readMode);

        while (strlen($code) < 0) {
            readline("No code found. Press ENTER to try again or press CRTL+C");
            $code = $this->ir::read($readMode);
        }

        return $code;
    }

}
try {
    $path = "../../conf/Mediatrix.conf";

    $myfile = fopen($path, "r+");
    $json = json_decode(fread($myfile,filesize("webdictionary.txt")));

    var_dump($json);

    $codes = array();
    $class = new readCode();
    $mode = $class->modes();

    while(true){
        echo "\nReading Code A:\n";
        $codes['a'] = $class->read($mode);

        if(strlen($codes['a'])>0){
            echo "Code A read\n";
            break;
        }

        readline("Couldn't read a Code. Press ENTER to try again or press CRTL+C");

    }

    while(true){
        while(true){
            echo "\nReading Code B:\n";
            $codes['b'] = $class->read($mode);

            if(strlen($codes['b'])>0){
                echo "Code A read\n";
                break;
            }

            readline("Couldn't read a Code. Press ENTER to try again or press CRTL+C");

        }


        if(strlen($codes['a']) === strlen($codes['b']) && $codes['a'] !== $codes['b'] ){
            echo "Both Codes are valid\n";
            break;
        }

        readline("The Codes read are not valid. Press ENTER to try again or press CRTL+C");
    }
}
catch (\Exception $ex){
    echo $ex->getMessage();
}