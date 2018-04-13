#!usr/bin/python

import RPi.GPIO as GPIO
from time import sleep

GPIO.setwarnings(False)			#disable warnings

GPIO.setmode(GPIO.BCM) # GPIO Nummern statt Board Nummern

PWMpin = 13				# PWM pin zum Anschluss des Luefters (PWM1 33,35)

GPIO.setup(PWMpin,GPIO.OUT)

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
    maxspeed = 1600     #Maximale Geschwindigkeit des Luefters in RPM
    prozent = 0
    if mt > st:
        rpm=(mt-st)*maxspeed/20     #Umdrehungen Pro Minute
        prozent=(mt-st)*5   #Prozent der Drehzahl
        if prozent > 100:
            prozent = 100

    return prozent



def pwm():
    fan_pwm = GPIO.PWM(PWMpin,100)		#create PWM instance with frequency
    fan_pwm.start(0)				#start PWM of required Duty Cycle
    while True:


        #Script has been called directly
        id = '28-0517605a65ff'
        mt = gettemp(id)/float(1000)    #Momentantemperatur
        print "Momentantemperatur : " + '{:.3f}'.format(mt)
        prozent = fanCon(mt)

        print "Prozent: " + '{:.3f}'.format(prozent)

        if prozent > 30:
            fan_pwm.ChangeDutyCycle(prozent) #provide duty cycle in the range 0-100
            sleep(60)

        elif prozent < 3:
            fan_pwm.ChangeDutyCycle(0)
            sleep(60)
        else:
            sleep(60)




    return

if __name__ == '__main__':

    pwm()







