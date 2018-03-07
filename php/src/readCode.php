<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 01.02.2018
 * Time: 20:31
 */
namespace Mediatrix;

echo "Reading IR-Code\n\n";

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
            throw new \Exception("IR-Device is busy. Try again later, or disconnect and reconnect the device.\n");
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
    $path = "../conf/Mediatrix.json";

    $myfile = fopen($path, "r+");
    $json = json_decode(fread($myfile,filesize($path)));

    $possibleKeys = array("av" => array(), "beamer" => array());

    $possibleKeys['av']['presets'] = array_keys((array)$json->av->presets);
    $possibleKeys['av']['volume'] = array_keys((array)$json->av->volume);
    $possibleKeys['av']['sources'] = array_keys((array)$json->av->sources);

    array_push($possibleKeys['beamer'], "power");
    $possibleKeys['beamer']['source'] = array_keys((array)$json->beamer->source);

    $pK = array();

    $i = 0;

    foreach ($possibleKeys as $k1 => $v1){
        printf("[*] %s:\n", $k1);
        foreach ($v1 as $k2 => $v2) {
            if(is_array($v2)){
                printf("[*]  |  %s:\n", $k2);
                foreach ($v2 as $v3) {
                    printf("[%d]  |   |  %s\n", $i, $v3);
                    $pK[$i][$k1][$k2][$v3] = "";
                    $i++;
                }
            }else{
                printf("[%d]  |  %s\n",$i, $v2);
                $pK[$i][$k1][$v2] = "";
                $i++;
            }
        }
    }

    while(true){
        $key = readline("\nWhich button do you want to read in? ");
        if(preg_match('/^[0-9]+$/',$key)){
            break;
        }
    }

    $codes = array();
    $class = new readCode();
    $mode = $class->modes();

    $choice = 0;

    while(true){

        if($choice == 0 || $choice ==1){
            while(true){
                echo "\nReading Code A:\n";
                $codes['a'] = $class->read($mode);

                if(strlen($codes['a'])>0){
                    echo "Code A read\n";
                    break;
                }

                readline("Couldn't read a Code. Press ENTER to try again or press CRTL+C");

            }
        }

        if($choice == 0 || $choice == 2) {
            while (true) {
                echo "\nReading Code B:\n";
                $codes['b'] = $class->read($mode);

                if (strlen($codes['b']) > 0) {
                    echo "Code B read\n";
                    break;
                }

                readline("Couldn't read a Code. Press ENTER to try again or press CRTL+C");

            }
        }


        if(strlen($codes['a']) === strlen($codes['b']) && $codes['a'] !== $codes['b'] ){
            echo "Both Codes are valid\n";
            break;
        }

        echo "The Codes read are not valid.\n\nCodes:\n";

        foreach($codes as $k => $v){
            printf("Code %s: %s\n",strtoupper($key), $value);
        }

        echo ("What do you want to do?\n0.....read both again\n1.....read Code A again\n2.....read Code B again\n");
        $choice = readline("");
    }

    fwrite($myfile,json_encode($json));

    foreach ($pK[$key] as $k1 => $v1){
        foreach ($v1 as $k2 => $v2){
            foreach ($v2 as $k3 => $v3){
                $json->$k1->$k2->$k3 = $codes;
                var_dump($json->$k1->$k2->$k3);
            }
        }
    }

    $json = json_encode($json,JSON_PRETTY_PRINT);

    ftruncate($myfile,0);
    rewind($myfile);
    fwrite($myfile,$json);

}
catch (\Exception $ex){
    echo $ex->getMessage();
}
finally
{
    fclose($myfile);
}