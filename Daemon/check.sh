#! /bin/bash

NAME=Mediatrix
DESC="Daemon for the mediatrix.sh websocket server"
PIDFILE="/var/run/${NAME}-server.pid"
LOGFILE="/var/log/${NAME}.log"

DAEMON="/usr/bin/php"
DAEMON_OPTS="/var/www/html/Mediatrix/php/src/websocket.php"

PYTHON_OPTS="--start --background --make-pidfile --chdir /var/www/html/Mediatrix/Elektronik"
PYTHON="/usr/bin/python"

START_OPTS="--start --background --make-pidfile --pidfile ${PIDFILE} --chuid www-data --chdir /var/www/html/Mediatrix/php --exec ${DAEMON} ${DAEMON_OPTS}"
STOP_OPTS="--stop --pidfile ${PIDFILE}"

WSSTART_OPS="--start --background --make-pidfile --pidfile /var/run/Mediatrix-websocket.pid --chuid www-data --chdir /var/www/html/Mediatrix/php --exec ${DAEMON} /var/www/html/Mediatrix/php/src/mixerLoop.php"

shopt -s nullglob
array=(/var/run/Mediatrix*)

while true
do
    for i in ${array[@]}; do
        if [ -z "$(ps -p $(cat $i) -o pid=)" ];  then
            case "$(echo $i | cut -d '-' -f 2 | cut -d '.' -f 1)" in
            speaker)
                echo  "Restarting speaker.py: " >> $LOGFILE
	            /sbin/start-stop-daemon $PYTHON_OPTS --pidfile "/var/run/Mediatrix-speaker.pid" --exec $PYTHON speaker.py
                echo $i;
            ;;
            cooling)
                echo  "Restarting cooling.py " >> $LOGFILE
	            /sbin/start-stop-daemon $PYTHON_OPTS --pidfile "/var/run/Mediatrix-cooling.pid" --exec $PYTHON cooling.py
                echo $i;
            ;;
            power)
                echo  "Restarting power.py: " >> $LOGFILE
                /sbin/start-stop-daemon $PYTHON_OPTS --pidfile "/var/run/Mediatrix-power.pid" --exec $PYTHON power.py
                echo $i;
            ;;
            websocket)
                echo "Restarting Mediatrix-websocket to Mixer"
    	        /sbin/start-stop-daemon $WSSTART_OPS >> $LOGFILE
                echo $i;
            ;;
            server)
                echo  "Restarting ${DESC}: Server" >> $LOGFILE
                /sbin/start-stop-daemon $START_OPTS >> $LOGFILE
                echo $i;
            ;;
            esac
        else
            echo "$i running"
        fi
    done;
    if [ -z "$(ps -C "olad" -o pid=)" ];  then
        echo "Restarting Olad" >> $LOGFILE
        sudo -u pi olad -f >> $LOGFILE
    else
        echo "olad running";
    fi
    sleep 10

done