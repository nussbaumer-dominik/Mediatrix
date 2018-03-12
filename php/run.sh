#!/usr/bin/env bash

printf "\n#####Pull Git:#####\n"

sudo git pull origin $1

cd ../cpp/DMX

printf "\n#####Compile C++ DMX:#####\n"

sudo rm DMX.o DMX.so

sudo make

sudo make install

cd ../IR

printf "\n#####Compile C++ IR:#####\n"

sudo rm IR.o IR.so

sudo make

sudo make install

cd ../../php

printf "\n#####Restart Apche:#####\n"

sudo service apache2 restart

printf "\n#####Start Olad:#####\n"
olad -f


printf "\n#####check DB:#####\n"
sudo php src/createDB.php

printf "\n#####Run Server:#####\n"
sudo -u www-data php src/websocket.php
