#!/usr/bin/python
# -*- coding: utf-8 -*-

import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM) # GPIO Nummern statt Board Nummern

# SET GPIO Button-Pin
btn = 15
panel = 7
door = 8

#Relais
rs = 2 #Relais Für Lautsprecher
rp = 3 #Relais für Strom //momentan für test

GPIO.setup(btn, GPIO.IN) # GPIO Modus zuweisen
GPIO.setup(panel, GPIO.IN) # GPIO Modus zuweisen
GPIO.setup(door, GPIO.IN) # GPIO Modus zuweisen

GPIO.setup(rs, GPIO.OUT) # GPIO Modus zuweisen
GPIO.setup(rp, GPIO.OUT) # GPIO Modus zuweisen


#Einschalten

pstate = 0 #Zustand des Systems Strom (1=Ein, 0=Aus)
sstate = 0 #Zustand des Systems Lautsprecher (1=Ein, 0=Aus)

def main():
    value = 0


    while True:

        if not GPIO.input(btn):
            value += 0.01

        if value > 0:

            if GPIO.input(btn):
                print "gedrueckt"
                main()
                switchPower(pstate)


        time.sleep(0.03)

        if GPIO.input(panel):
            print "offen"
            main()
            switchPower(sstate)

        time.sleep(0.03)

        if GPIO.input(btn):
            print "offen"
            main()
            switchPower(sstate)


        time.sleep(0.03)


    return 0

if __name__ == '__main__':
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(btn, GPIO.IN)
    main()

#Strom schalten
def switchPower(pstate):

    if pstate == 0:
        GPIO.output(rp, GPIO.HIGH) # an
        time.sleep(20.00)
        sstate = 1
        GPIO.output(rs, GPIO.HIGH) # an

    if pstate == 1:
        sstate = 0
        GPIO.output(rs, GPIO.LOW)
        time.sleep(1.00)
        GPIO.output(rp, GPIO.LOW)



#Lautsprecher schalten
def switchSpeaker(sstate):
    if sstate == 0:
        GPIO.output(rs, GPIO.HIGH) # an
        sstate = 1

    if sstate == 1:
        GPIO.output(rs, GPIO.LOW) # aus
        sstate = 0




