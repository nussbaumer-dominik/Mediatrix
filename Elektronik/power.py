#!/usr/bin/python
# -*- coding: utf-8 -*-


import time
import RPi.GPIO as GPIO

# SET GPIO Button-Pin
btn = 15
panel = 7
door = 8

#Einschalten

def main():
    value = 0

    while True:

        if not GPIO.input(btn):
            value += 0.01

        if value > 0:

            if GPIO.input(btn):
                print "gedrueckt"
                main()

        time.sleep(0.03)

    return 0

if __name__ == '__main__':
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(btn, GPIO.IN)
    main()



