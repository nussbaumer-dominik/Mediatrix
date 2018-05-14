<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 07.12.2017
 * Time: 21:53
 */

namespace Mediatrix;

use Firebase\JWT\JWT;

require __DIR__ . '/../vendor/autoload.php';

class Login
{
    private $ldap;
    private $config = [
        'default' => [
            'domain_controllers'    => ['10.0.0.209'],
            'base_dn'               => 'ou=Users,dc=htlw3r,dc=ac,dc=at',
            'admin_username'        => '3827',
            'admin_password'        => 'k?2Z=_3Q',

            'use_tls'               => false
        ],
    ];
    private $key;
    private $expireSec = 3600;
    private $url = "https://moodle.htl.rennweg.at/login/index.php";

    public function __construct()
    {
        //$this->ldap = new \Adldap\Adldap($this->config);
        $this->key = base64_decode(Key::getKey());
    }

    /**
     * @param $username
     * @param $password
     */
    public function login($username, $password){

        try {

/*
            // Connect to the provider you specified in your configuration.
            $provider = $this->ldap->connect('default');

            if ($provider->auth()->attempt($username, $password)) {
                echo ("Login success");
            } else {
                echo "Login false";
                print_r($provider);
            }*/

            $url = $this->get_redirect_target($this->url,$username,$password);

            $session = explode('?',$url);

            if(isset($session[1])){
                $data = [
                    'iat'  => time(),         // Issued at: time when the token was generated
                    'jti'  => base64_encode(random_bytes(32)),          // Json Token Id: an unique identifier for the token
                    'iss'  => "Mediatrix",       // Issuer
                    'nbf'  => time(),        // Not before
                    'exp'  => time()+$this->expireSec,           // Expire
                    'data' => [                  // Data related to the signer used
                        'userName' => $username // User name
                    ]
                ];

                $sqlite = new \SQLite3("../../sqlite/db.sqlite");

                $stm = $sqlite->prepare("SELECT password FROM user WHERE id = :id");

                $stm->bindParam(":id", $username);

                $result = $stm->execute();

                $hasResult = false;

                while ($res = $result->fetchArray(SQLITE3_ASSOC)) {
                    $hasResult = true;
                    password_verify($password,$res['password']) or die('{"success":false,"err":"Wrong Password"}');
                }

                $result->finalize();

                $stm->close();

                if(!$hasResult) {
                    $password = password_hash($password,PASSWORD_DEFAULT);

                    $stm = $sqlite->prepare("INSERT INTO USER(id,password) VALUES (:id,:password)");

                    $stm->bindParam(":id", $username);
                    $stm->bindParam(":password", $password);

                    $stm->execute();

                    $stm->close();
                }

                $sqlite->close();

                $jwt = JWT::encode($data, $this->key,'HS256');

                $unencodedArray = ['jwt' => $jwt];
                echo json_encode($unencodedArray);


            }else{
                echo "Login false";
            }

        } catch (\Adldap\Auth\UsernameRequiredException $e) {
            echo ("error User: ".$e->getMessage());
        } catch (\Adldap\Auth\PasswordRequiredException $e) {
            // The user didn't supply a password.
            echo ("error Passwd: ".$e->getMessage());
        }catch (\Adldap\Auth\BindException $e){
            echo ("error Bind: ".$e->getMessage());
        }

    }

    /**
     * @return array
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * @param array $config
     */
    public function setConfig($config)
    {
        $this->config = $config;
    }

    function get_redirect_target($url, $username, $password)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_NOBODY, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,
            "password=$password&username=$username");
        // receive server response ...
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $headers = curl_exec($ch);
        curl_close($ch);
        // Check if there's a Location: header (redirect)
        if (preg_match('/^Location: (.+)$/im', $headers, $matches))
            return trim($matches[1]);
        // If not, there was no redirect so return the original URL
        // (Alternatively change this to return false)
        return $url;
    }

}

$l = new Login();

preg_match('/^[A-Za-z0-9]+$/',$_POST['username']) or die('{"success":false,"err":"Username not valid"}');
preg_match('/^[A-Za-z0-9\?\_\=\)\(\/\&\%\$\§\"\!\{\[\]\}\\\+\#\'\*]+$/',$_POST['password']) or die('{"success":false,"err":Password not valid"}');

$username = $_POST['username'];
$passwd = $_POST['password'];

$l->login($_POST['username'],$_POST['password']);
