#! /bin/bash

NAME=mediatrix
DESC="Daemon for the mediatrix websocket server"
PIDFILE="/var/run/${NAME}.pid"
LOGFILE="/var/log/${NAME}.log"

DAEMON="/usr/bin/php"
DAEMON_OPTS="/var/www/html/Mediatrix/php/src/websocket.php"

START_OPTS="--start --background --make-pidfile --pidfile ${PIDFILE} --chuid www-data --chdir /var/www/html/Mediatrix/php --exec ${DAEMON} ${DAEMON_OPTS}"
STOP_OPTS="--stop --pidfile ${PIDFILE}"

while true
do
    if [[ $(sudo kill -0 $(cat $1)) ]];  then
        $(/sbin/start-stop-daemon $START_OPTS >> $LOGFILE)
    else
        echo "running"
    fi
    sleep 10

done