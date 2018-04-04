#!usr/bin/python

import RPi.GPIO as GPIO
from time import sleep

GPIO.setwarnings(False)			#disable warnings

GPIO.setmode(GPIO.BCM) # GPIO Nummern statt Board Nummern

# SET GPIO Button-Pin
door = 7

#Relais
rs = 2 #Relais Fur Lautsprecher
rp = 3 #Relais fur Strom //momentan fur test

# GPIO Modus zuweisen
GPIO.setup(door, GPIO.IN, pull_up_down = GPIO.PUD_UP)

GPIO.setup(rs, GPIO.OUT)
GPIO.setup(rp, GPIO.OUT)

#Einschalten

pstate = 0 #Zustand des Systems Strom (1=Ein, 0=Aus)
sstate = 0 #Zustand des Systems Lautsprecher (1=Ein, 0=Aus)


#Lautsprecher schalten
def speakerOn():
    global sstate

    print "changing Speaker-State"
    print sstate

    GPIO.output(rs, GPIO.LOW) # an
    sstate = 0


def speakerOff():
    global sstate

    print "changing Speaker-State"
    print sstate

    GPIO.output(rs, GPIO.HIGH) # aus
    sstate = 1

if __name__ == '__main__':

    GPIO.output(rs, GPIO.HIGH) # aus

    while True:
        if sstate == 0:
            GPIO.wait_for_edge(door, GPIO.RISING)
            speakerOff()

        if sstate == 1:
            GPIO.wait_for_edge(door, GPIO.FALLING)
            speakerOn()
