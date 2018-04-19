#! /bin/sh

while true
do
    if [$(sudo kill -0 $1)];  then
        echo "running"
    else
        $(sudo service mediatrix restart)
    fi
    sleep 10

done