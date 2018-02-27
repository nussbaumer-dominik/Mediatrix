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
            readline("No code found. Press Enter to try again or Crtl+C to abroad.");
            $code = $this->ir::read($readMode);
        }

        return $code;
    }

}
try {
    $codes = array();
    $class = new readCode();
    $mode = $class->modes();

    echo "\nReading Code A:\n";
    $codes['a'] = $class->read($mode);

    echo "check: ";
    var_dump($this->ir::check());

    echo "\nReading Code B:\n";
    $codes['b'] = $class->read($mode);

    if(strlen($codes['a']) != strlen($codes['b']) || $codes['a'] === $codes['b'] ){
        echo "false\n";
        var_dump($codes);
    }
    echo "passt";
}
catch (\Exception $ex){
    echo $ex->getMessage();
}