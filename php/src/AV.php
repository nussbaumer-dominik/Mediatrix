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
    private $volumeCodes;
    private $volumeSteps;
    private $presets;
    private $ir;
    private $sources;

    /**
     * AV constructor.
     * @param array $source
     * @param array $volumeCodes
     * @param array $presets
     */
    function __construct(array $source, array $volumeCodes, array $presets, int $volumeSteps)
    {
        foreach ($source as $k => $s){
            $source[$k]['nextActive'] = false;
            $source[$k]['lastSendA'] = false;
        }

        $source[0]['nextActive'] = true;

        $this->sources = $source;

        foreach ($volumeCodes as $k => $s){
            $volumeCodes[$k]['lastSendA'] = false;
        }

        $this->volumeCodes = $volumeCodes;


        $this->presets = $presets;

        $this->volumeSteps = $volumeSteps;


        $this->ir = new \IR();
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
     * @return array
     */
    public function setVolumeLevel($volumeLevel)
    {


        $times = ($this->volumeLevel - $volumeLevel) % $this->volumeSteps;

        if($times < 0 ){

            //get Code
            $code = $this->volumeCodes['down']['lastSendA'] ? $this->volumeCodes['down']['b']:$this->volumeCodes['down']['a'];

            $this->$this->volumeCodes['down']['lastSendA'] = !$this->$this->volumeCodes['down']['lastSendA'];

        }else{

            //get Code
            $code = $this->volumeCodes['up']['lastSendA'] ? $this->volumeCodes['up']['b']:$this->volumeCodes['up']['a'];

            $this->$this->volumeCodes['up']['lastSendA'] = !$this->$this->volumeCodes['up']['lastSendA'];

        }

        $timesSent = intval($times);

        //send IR code
        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5*abs($timesSent))));


        $this->volumeLevel += $timesSent;

        return $r;
    }

    /**
     * @param number $presets
     * @return mixed
     */
    public function setPreset($presets)
    {

        //get Code
        $code = $this->presets[$presets]['lastSendA'] ? $this->presets[$presets]['b']:$this->presets[$presets]['a'];

        $this->presets[$presets]['lastSendA'] = !$this->presets[$presets]['lastSendA'];

        //send IR code
        return json_decode(str_replace("'",'"',$this->ir->send($code,5)));

    }

    function changeSource()
    {
        echo "change Source \n";

        //get next active Source
        $next = array_filter($this->sources,function ($el){
            return $el['nextActive'] == true;
        })[0];

        $index = array_search($next,$this->sources);

        //get code
        $code = $next['lastSendA'] ? $next['b']:$next['a'];

        $this->sources[$index]['lastSendA'] = !$this->sources[$index]['lastSendA'];

        //send IR code
        $r = json_decode(str_replace("'",'"',$this->ir->send($code,5)));


        //set next active Source
        $this->sources[$index]['nextActive'] = false;

        $index + 1 > count($this->sources)-1 ? $index = 0 : $index++;

        $this->source[$index]['nextActive'] = true;

        //return Result
        return $r;
    }
}