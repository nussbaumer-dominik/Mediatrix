#include <wiringPi.h>
#include <wiringSerial.h>
#include <iostream>
//#include <string>

using namespace std;

int main()
{
    cout<<"Hello World!\n";


		//Test
		/*
		printf("Test\n");
		wiringPiSetup();
		printf("1\n");
		pinMode (0, OUTPUT);
		digitalWrite (0, HIGH);
		delay(5000);
		digitalWrite (0, LOW);
		printf("Passt\n");
*/


		//Serial write
		int fd = serialOpen("/dev/ttyUSBir", 9600);

/*
		serialPrintf(fd, "174c4242802210081019100810081");
		serialFlush (fd);
		delay(2000);
		serialPrintf(fd, "w03");
		serialFlush(fd);
		cout<<"Serial Works\n";

		delay(1000);
*/
		//read
		serialPrintf(fd, ":~:");
        serialFlush (fd);

		serialPrintf(fd, "l01:");
		serialFlush(fd);
		int n1 = serialDataAvail(fd);
		int c = serialGetchar(fd);
		int n2 = serialDataAvail(fd);


		cout<<"NumberofChars: "<<n1<<", Char: "<<c<<", nmchar: "<<n2<<endl;

		cout<<"Lesen geht\n";

		return 0;
}
