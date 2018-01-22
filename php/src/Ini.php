<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 21.11.2017
 * Time: 19:39
 */

namespace Mediatrix;



use Ratchet\Wamp\Exception;

class Ini
{
    private $FILE = "Mediatrix.json";

    /**
     * Ini constructor.
     * @param $app
     */
    public function __construct(Application $app)
    {
        $this->iniMe($app);
    }

    /**
     * @param $app
     */
    public function iniMe(Application $app){

        try {
            $ini = file_get_contents($this->FILE, true);
            $ini = json_decode($ini, true);

            $scheinwerfer = array();

            foreach($ini["DMX"] as $entry){

                array_push($scheinwerfer,
                    new Scheinwerfer(array(
                        "hue" => $entry["hue"]
                        )
                    )
                );

            }

            $app->setScheinwerfer($scheinwerfer);

            //print_r($scheinwerfer);

        }catch (Exception $ex){
            echo $ex->getMessage();
            throw new Exception("Error open and parsing ini-Json");
        }


    }

}