<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 28.01.2018
 * Time: 20:47
 */

namespace Mediatrix;


class AV
{
    private $volumeLevel;
    private $maxVolume;
    private $minVolume;

    private $volumeCodes;
    private $volumeSteps;
    private $presets;
    private $ir;
    private $sources;
    private $gpio;
    private $powerCodes;
    private $iniLevel;

    /**
     * AV constructor.
     * @param array $source
     * @param array $volumeCodes
     * @param array $presets
     * @param int $volumeSteps
     * @param int $maxVolume
     * @param int $minVolume
     * @param int $gpio
     * @param array $powerCodes
     */
    function __construct(array $source, array $volumeCodes, array $presets, $volumeSteps, $maxVolume, $minVolume, int $gpio, array $powerCodes, $iniVolume)
    {

        $this->ir = new \IR();


        foreach ($source as $k => $s){
            var_dump($k);
            $source[$k]['nextActive'] = false;
            $source[$k]['lastSendA'] = false;
        }

        $source[0]['nextActive'] = true;

        $this->sources = $source;


        foreach ($volumeCodes as $k => $s){
            $volumeCodes[$k]['lastSendA'] = false;
        }

        $this->volumeCodes = $volumeCodes;


        foreach ($presets as $k => $s){
            $presets[$k]['lastSendA'] = false;
        }

        $this->presets = $presets;



        $powerCodes['lastSendA'] = false;

        $this->powerCodes = $powerCodes;


        $this->gpio = $gpio;

        exec('gpio -g mode '.$gpio.' in');


        $this->volumeSteps = $volumeSteps;

        $this->maxVolume = $maxVolume;

        $this->minVolume = $minVolume;

        $this->iniLevel = $iniVolume;

        $this->on();


        /*//set Volume Level to min Vaule ad then to half
        $this->volumeLevel = $maxVolume;

        $this->setVolumeLevel($minVolume);

        $this->setVolumeLevel($minVolume + ($maxVolume-$minVolume)/2);*/

    }

    /**
     * @return mixed
     */
    public function getVolumeLevel()
    {
        return $this->volumeLevel;
    }

    /**
     * @param mixed $volumeLevel
     * @return object
     */
    public function setVolumeLevel($volumeLevel)
    {

        if(!$this->isOn()){
            $this->on();
        }

        echo "change AV-Volume\n";

        $times = (($volumeLevel - $this->volumeLevel) * 1.0) / $this->volumeSteps;

        if($times == 0){
            return (object) array("success" => true, "err" => "");
        }

        if($times < 0 ){

            //get Code
            $code = $this->volumeCodes['down']['lastSendA'] ? $this->volumeCodes['down']['b']:$this->volumeCodes['down']['a'];

            $this->volumeCodes['down']['lastSendA'] = !$this->volumeCodes['down']['lastSendA'];

        }else{

            //get Code
            $code = $this->volumeCodes['up']['lastSendA'] ? $this->volumeCodes['up']['b']:$this->volumeCodes['up']['a'];

            $this->volumeCodes['up']['lastSendA'] = !$this->volumeCodes['up']['lastSendA'];

        }

        $timesSent = intval($times);

        //send IR code
        $r = json_decode(str_replace("'",'"',$this->ir->send($code,abs($timesSent))));

        $this->volumeLevel += $timesSent  * $this->volumeSteps;

        return $r;
    }

    /**
     * @param mixed $preset
     * @return mixed
     */
    public function setPreset($preset)
    {

        if(!$this->isOn()){
            $this->on();
        }

        //get Code
        $code = $this->presets[$preset]['lastSendA'] ? $this->presets[$preset]['b']:$this->presets[$preset]['a'];

        $this->presets[$preset]['lastSendA'] = !$this->presets[$preset]['lastSendA'];

        //send IR code
        return json_decode(str_replace("'",'"',$this->ir->send($code,5)));

    }

    function changeSource()
    {
        if(!$this->isOn()){
            $this->on();
        }

        echo "change Source \n";

        //get next active Source
        $next = array_pop(array_filter($this->sources,function ($el){
            return $el['nextActive'] == true;
        }));

        $index = array_search($next,$this->sources);

        //get code
        $code = $next['lastSendA'] ? $next['b']:$next['a'];

        $this->sources[$index]['lastSendA'] = !$this->sources[$index]['lastSendA'];

        //send IR code
        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5)));


        //set next active Source
        $this->sources[$index]['nextActive'] = false;

        $index + 1 > count($this->sources)-1 ? $index = 0 : $index++;

        $this->sources[$index]['nextActive'] = true;

        //return Result
        return $r;
    }

    function on()
    {
        if($this->isOn()){
            $this->volumeLevel = $this->iniLevel;

            return (object) array("success"=>true,"err"=>"");
        }

        echo "AV on \n";

        //get Code
        $code = $this->powerCodes['lastSendA'] ? $this->powerCodes['b']:$this->powerCodes['a'];

        $this->powerCodes['lastSendA'] = !$this->powerCodes['lastSendA'];

        //send IR code
        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5)));

        if($r->success){
            $this->volumeLevel = $this->iniLevel;
        }

        //return Result
        return $r;

    }

    function off()
    {
        if(!$this->isOn()){
            return (object) array("success"=>true,"err"=>"");
        }

        echo "AV off\n";

        $erg = $this->on();

        return $erg;

    }

    /**
     * @return array
     */
    public function getPresets(): array
    {
        return $this->presets;
    }

    /**
     * @return int
     */
    public function getMaxVolume(): int
    {
        return $this->maxVolume;
    }

    /**
     * @return int
     */
    public function getMinVolume(): int
    {
        return $this->minVolume;
    }

    /**
     * @return array
     */
    public function getSource(): string
    {
        return "test";
    }

    function isOn(){

        return exec('gpio -g read '.$this->gpio) == 1;
    }

}