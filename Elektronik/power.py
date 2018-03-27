#!/usr/bin/python
# -*- coding: utf-8 -*-

import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM) # GPIO Nummern statt Board Nummern

# SET GPIO Button-Pin
btn = 15
door = 8

#Relais
rs = 2 #Relais Für Lautsprecher
rp = 3 #Relais für Strom //momentan für test

# GPIO Modus zuweisen
GPIO.setup(btn, GPIO.IN)
GPIO.setup(door, GPIO.IN)

GPIO.setup(rs, GPIO.OUT)
GPIO.setup(rp, GPIO.OUT)


#Einschalten

pstate = 0 #Zustand des Systems Strom (1=Ein, 0=Aus)
sstate = 0 #Zustand des Systems Lautsprecher (1=Ein, 0=Aus)

def main():
    value = 0

#Einschalter abfragen
    while True:

        if not GPIO.input(btn):
            value += 0.01

        if value > 0:

            if GPIO.input(btn):
                print "gedrueckt"
                main()
                switchPower(pstate, sstate)

        time.sleep(0.03)

#Magnetkontakt Tür abfragen

        if GPIO.input(door):
            print "offen"
            main()
            switchSpeaker(sstate)

        time.sleep(0.03)

        print value;

    return 0



#Strom schalten
def switchPower(evt):

    print "changing Power-State"
    print pstate

    if pstate == 0:
        GPIO.output(rp, GPIO.HIGH) # an
        time.sleep(20)
        sstate = 1
        GPIO.output(rs, GPIO.HIGH) # an

    if pstate == 1:
        sstate = 0
        GPIO.output(rs, GPIO.LOW)  #aus
        time.sleep(1)
        GPIO.output(rp, GPIO.LOW)  #aus



#Lautsprecher schalten
def switchSpeaker():
    if sstate == 0:
        GPIO.output(rs, GPIO.HIGH) # an
        sstate = 1

    if sstate == 1:
        GPIO.output(rs, GPIO.LOW) # aus
        sstate = 0

GPIO.add_event_detect(btn, GPIO.RISING, callback=switchPower, bouncetime=300)


if __name__ == '__main__':

    #main()
    print "los"
    while True:
        print "cool"
        time.sleep(10)