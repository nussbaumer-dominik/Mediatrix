#! /bin/bash

while true
do
    if [[ $(sudo kill -0 $(echo $1)) ]];  then
        $(sudo service mediatrix restart)
    else
        echo "running"
    fi
    sleep 10

done