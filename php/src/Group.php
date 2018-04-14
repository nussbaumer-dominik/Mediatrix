<?php

namespace Mediatrix;


use Ratchet\ConnectionInterface;

class Group
{

    private $users;
    private $slots;
    private $admin;

    public function __construct()
    {
        $this->users = new \SplObjectStorage;
        $this->slots = 2;
        $this->admin = null;
    }

    public function addUser(ConnectionInterface $conn){
        if($this->slots > $this->users->count()){
            $this->users->attach($conn);
            if(is_null($this->admin)){
                $this->admin = $conn;
            }
        }
    }

    public function removeUser(ConnectionInterface $conn){
        $this->users->detach($conn);
        if($this->admin == $conn && $this->users->count() == 0){
            $this->admin = null;
        }elseif ($this->admin == $conn && $this->users->count() > 0){
            $this->admin = $this->users->current();
        }
    }

    /**
     * @return \SplObjectStorage
     */
    public function getUsers(): \SplObjectStorage
    {
        return $this->users;
    }

    /**
     * @param int $slots
     */
    public function setSlots(int $slots)
    {
        $this->slots = $slots;
    }

    public function __destruct()
    {
        foreach ($this->users as $user){
            $user->close();
        }
    }

    public function send($msg){
        foreach ($this->users as $user){
            $user->send($msg);
        }
    }

    /**
     * @return mixed
     */
    public function getAdmin()
    {
        return $this->admin;
    }

    /**
     * @return int
     */
    public function getSlots(): int
    {
        return $this->slots;
    }
}