#!usr/bin/python

import RPi.GPIO as GPIO
from time import sleep

import subprocess

GPIO.setwarnings(False)			#disable warnings

GPIO.setmode(GPIO.BCM) # GPIO Nummern statt Board Nummern

# SET GPIO Button-Pin
btn = 15

#Relais
rs = 2 #Relais Fur Lautsprecher
rp = 3 #Relais fur Strom //momentan fur test

# GPIO Modus zuweisen
GPIO.setup(btn, GPIO.IN, pull_up_down = GPIO.PUD_UP)

GPIO.setup(rs, GPIO.OUT)
GPIO.setup(rp, GPIO.OUT)

GPIO.output(rs, GPIO.HIGH)  #aus
GPIO.output(rp, GPIO.HIGH)



#Strom schalten
def switchPower(pstate):

    print "changing Power-State"
    print pstate

    if pstate == 0:
        print "ein"
        GPIO.output(rs, GPIO.HIGH) # an
        GPIO.output(rp, GPIO.LOW) # an
        sleep(20)
        GPIO.output(rs, GPIO.LOW) # an
        sleep(2)
        pstate = 1
        file = open("deviceson","w")
        file.write("1")
        file.close()

    elif pstate == 1:
        print "aus"
        GPIO.output(rs, GPIO.HIGH)  #aus
        sleep(1)
        GPIO.output(rp, GPIO.HIGH)  #aus
        pstate = 0
        file = open("deviceson","w")
        file.write("0")
        file.close()

        subprocess.call("php /var/www/html/Mediatrix/php/src/beamerOff.php.php")

    return pstate



if __name__ == '__main__':

    pstate = 0 #Zustand des Systems Strom (1=Ein, 0=Aus)

    file = open("deviceson","w")
    file.write("0")
    file.close()

    while True:
        GPIO.wait_for_edge(btn, GPIO.RISING)
        pstate = switchPower(pstate)