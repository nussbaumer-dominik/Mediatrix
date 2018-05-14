#! /bin/bash

set -x

NAME=Mediatrix
DESC="Daemon for the mediatrix websocket server"
PIDFILE="/var/run/${NAME}-server.pid"
LOGFILE="/var/log/${NAME}.log"

DAEMON="/usr/bin/php"
DAEMON_OPTS="/var/www/html/Mediatrix/php/src/websocket.php"

PYTHON_OPTS="--start --background --make-pidfile --chdir /var/www/html/Mediatrix/Elektronik"
PYTHON="/usr/bin/python"

START_OPTS="--start --background --make-pidfile --pidfile ${PIDFILE} --chuid www-data --chdir /var/www/html/Mediatrix/php --exec ${DAEMON} ${DAEMON_OPTS}"
STOP_OPTS="--stop --pidfile ${PIDFILE}"

shopt -s nullglob
array=(/var/run/Mediatrix*)

while true
do
    for i in ${array[@]}; do
        echo $i;
        if [ -z "$(ps -p $(cat $i) -o pid=)" ];  then
            case "$(echo $i | cut -d '-' -f 2 | cut -d '.' -f 1)" in
            speaker)
                echo -n "Restarting speaker.py: " >> $LOGFILE
	            /sbin/start-stop-daemon $PYTHON_OPTS --pidfile "/var/run/Mediatrix-speaker.pid" --exec $PYTHON speaker.py
                echo $i;
            ;;
            cooling)
                echo -n "Restarting cooling.py " >> $LOGFILE
	            /sbin/start-stop-daemon $PYTHON_OPTS --pidfile "/var/run/Mediatrix-cooling.pid" --exec $PYTHON cooling.py
                echo $i;
            ;;
            power)
                echo -n "Restarting power.py: " >> $LOGFILE
                /sbin/start-stop-daemon $PYTHON_OPTS --pidfile "/var/run/Mediatrix-power.pid" --exec $PYTHON power.py
                echo $i;
            ;;
            websocket)
                echo $i;
            ;;
            server)
                echo -n "Restarting ${DESC}: Server" >> $LOGFILE
                /sbin/start-stop-daemon $START_OPTS >> $LOGFILE
                echo $i;
            ;;
            esac
        else
            echo "running"
        fi
    done;
    if [ -z "$(ps -C "olad" -o pid=)" ];  then
        echo "olad"
    else
        echo "running";
    fi
    sleep 10

done