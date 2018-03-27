#!usr/bin/python

import RPi.GPIO as GPIO
from time import sleep

GPIO.setwarnings(False)			#disable warnings

GPIO.setmode(GPIO.BCM) # GPIO Nummern statt Board Nummern

# SET GPIO Button-Pin
btn = 15
door = 8
PWMpin = 13				# PWM pin zum Anschluss des Luefters (PWM1 33,35)

#Relais
rs = 2 #Relais Fur Lautsprecher
rp = 3 #Relais fur Strom //momentan fur test

# GPIO Modus zuweisen
GPIO.setup(btn, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
GPIO.setup(door, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)

GPIO.setup(rs, GPIO.OUT)
GPIO.setup(rp, GPIO.OUT)

GPIO.setup(PWMpin,GPIO.OUT)


#Einschalten

pstate = 0 #Zustand des Systems Strom (1=Ein, 0=Aus)
sstate = 0 #Zustand des Systems Lautsprecher (1=Ein, 0=Aus)



#Measuring temperature
def gettemp(id):
    try:
        mytemp = ''
        filename = 'w1_slave'
        f = open('/sys/bus/w1/devices/' + id + '/' + filename, 'r')
        line = f.readline() # read 1st line
        crc = line.rsplit(' ',1)
        crc = crc[1].replace('\n', '')
        if crc=='YES':
            line = f.readline() # read 2nd line
            mytemp = line.rsplit('t=',1)
        else:
            mytemp = 99999
        f.close()
        return int(mytemp[1])
    except:
        return 99999


# Lueftersteuerung
def fanCon(mt):
    st = 35.0           #Solltemperatur in Grad Celsius (Temperaturraum 35-55 Grad)
    maxspeed = 3800     #Maximale Geschwindigkeit des Luefters in RPM
    prozent = 0
    if mt > st:
        rpm=(mt-st)*190     #Umdrehungen Pro Minute
        prozent=(mt-st)*5   #Prozent der Drehzahl
        if prozent > 100:
            prozent = 100

    return prozent



def pwm():
    fan_pwm = GPIO.PWM(PWMpin,100)		#create PWM instance with frequency
    fan_pwm.start(0)				#start PWM of required Duty Cycle
    while True:


        #Script has been called directly
        id = '10-000801a96106'
        mt = gettemp(id)/float(1000)    #Momentantemperatur
        print "Momentantemperatur : " + '{:.3f}'.format(mt)
        prozent = fanCon(mt)

        print "Prozent: " + '{:.3f}'.format(prozent)

        if prozent > 20:
            fan_pwm.ChangeDutyCycle(prozent) #provide duty cycle in the range 0-100
            sleep(2)

        if prozent < 20:
            fan_pwm.ChangeDutyCycle(0)
            sleep(2)


    return

#Strom schalten
def switchPower(evt):
    global sstate, pstate

    GPIO.remove_event_detect(btn)

    print "changing Power-State"
    print pstate

    if pstate == 0:
        GPIO.output(rp, GPIO.HIGH) # an
        sleep(20)
        sstate = 1
        GPIO.output(rs, GPIO.HIGH) # an
        pstate = 1

    if pstate == 1:
        sstate = 0
        GPIO.output(rs, GPIO.LOW)  #aus
        sleep(1)
        GPIO.output(rp, GPIO.LOW)  #aus
        pstate = 0

    GPIO.add_event_detect(btn, GPIO.RISING, callback=switchPower, bouncetime=300)



#Lautsprecher schalten
def switchSpeaker(evt):
    global sstate

    print "changing Speaker-State"
    print pstate

    GPIO.remove_event_detect(door)

    if sstate == 0:
        GPIO.output(rs, GPIO.HIGH) # an
        sstate = 1

    if sstate == 1:
        GPIO.output(rs, GPIO.LOW) # aus
        sstate = 0

    GPIO.add_event_detect(door, GPIO.RISING, callback=switchPower, bouncetime=300)





GPIO.add_event_detect(btn, GPIO.RISING, callback=switchPower, bouncetime=300)
GPIO.add_event_detect(door, GPIO.RISING, callback=switchPower, bouncetime=300)


if __name__ == '__main__':

    pwm()







