#!usr/bin/python

import RPi.GPIO as GPIO
from time import sleep

GPIO.setwarnings(False)			#disable warnings

GPIO.setmode(GPIO.BCM) # GPIO Nummern statt Board Nummern

# SET GPIO Button-Pin
btn = 15

#Relais
rs = 2 #Relais Fur Lautsprecher
rp = 3 #Relais fur Strom //momentan fur test

# GPIO Modus zuweisen
GPIO.setup(btn, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)

GPIO.setup(rs, GPIO.OUT)
GPIO.setup(rp, GPIO.OUT)

#Einschalten

pstate = 0 #Zustand des Systems Strom (1=Ein, 0=Aus)
sstate = 0 #Zustand des Systems Lautsprecher (1=Ein, 0=Aus)

#Strom schalten
def switchPower():
    global sstate, pstate

    print "changing Power-State"
    print pstate
    print sstate

    if pstate == 0:
        GPIO.output(rp, GPIO.HIGH) # an
        sleep(1)
        sstate = 1
        GPIO.output(rs, GPIO.HIGH) # an
        pstate = 1

    if pstate == 1:
        sstate = 0
        GPIO.output(rs, GPIO.LOW)  #aus
        sleep(1)
        GPIO.output(rp, GPIO.LOW)  #aus
        pstate = 0

    print pstate
    print sstate


if __name__ == '__main__':

    while True:
        GPIO.wait_for_edge(btn, GPIO.RISING)
        switchPower()