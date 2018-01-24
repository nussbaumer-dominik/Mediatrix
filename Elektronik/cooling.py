#!usr/bin/python

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

if __name__ == '__main__':
    # Script has been called directly
    id = '10-000801a96106'
    t = gettemp(id)/float(1000)
    print "Temp : " + '{:.3f}'.format(t)

def pwm():

    import RPi.GPIO as GPIO
    from time import sleep

    ledpin = 12				# PWM pin connected to LED
    GPIO.setwarnings(False)			#disable warnings
    GPIO.setmode(GPIO.BOARD)		#set pin numbering system
    GPIO.setup(ledpin,GPIO.OUT)
    pi_pwm = GPIO.PWM(ledpin,1000)		#create PWM instance with frequency
    pi_pwm.start(0)				#start PWM of required Duty Cycle
    while True:
        for duty in range(0,101,1):
            pi_pwm.ChangeDutyCycle(duty) #provide duty cycle in the range 0-100
            sleep(0.01)
        sleep(0.5)

        for duty in range(100,-1,-1):
            pi_pwm.ChangeDutyCycle(duty)
            sleep(0.01)
        sleep(0.5)


    return

def fanCon(t):
    try:
        rpm = ''

        if t >= 30:

    return

