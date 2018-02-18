#include <wiringPi.h>
#include <wiringSerial.h>
#include <iostream>
#include <string>
#include <cerrno>
#include <sstream>

#include <phpcpp.h>

using namespace std;

class IR : public Php::Base {
    private:
     static constexpr const char* dev = "/dev/ttyUSBir";

    public:
     static Php::Value send(Php::Parameters &params){

        string timesStr = params[1];
        int times = params[1];

        //open serial connection to IR-Device
        int fd = serialOpen(IR::dev, 9600);

        if(fd == -1){
            return "{'success':'false','err':'Can not open Serial Connection to IR-Device'}";
        }

        //reset the IR-Device
        serialPrintf(fd,":~:");
        delay(20);

        //convert given code to string
        string code = params[0];

        Php::out << ("p"+code+"]:").c_str() << endl;

        //send code to IR-Device
        serialPrintf(fd,("p"+code+"]:").c_str());
        delay(20);

        for( int i = 1; 99 * i <= times; i++){
            std::cout << ("w"+99+":").c_str() << endl;

            //send amount of repetitions of the code to the IR-Device
            serialPrintf(fd, ("w"+99+":").c_str());
            delay(150*times);
        }

        times %= 99;

        if(timesStr.length()==1){
            timesStr = "0"+timesStr;
        }

        std::cout << ("w"+timesStr+":").c_str() << endl;

        //send amount of repetitions of the code to the IR-Device
        serialPrintf(fd, ("w"+timesStr+":").c_str());
        delay(150*times);

        return "{'success':'true','err':''}";
     }

     static Php::Value read(Php::Parameters &params){

        string mode = params[0];

        if(mode.length()==1){
            mode = "0"+mode;
        }

        int fd = serialOpen(IR::dev, 9600);

        if(fd == -1){
            return "{'success':'false','err':'Can not open Serial Connection to IR-Device'}";
        }

        serialPrintf(fd,":~:");
        delay(20);

        cout << "PLease Press the button.." << flush;

        serialPrintf(fd,("l"+mode+":").c_str());

        for(int i = 200; i < 2000; i += 200){
            delay(i);
            cout << "." << flush;

        }

        cout << endl << flush;

        string erg = "";

        while (serialDataAvail (fd))
        {
            erg += serialGetchar (fd);
        }

        return erg;

     }

     static Php::Value getMode(){

        //open serial connection to IR-Device
        int fd = serialOpen(IR::dev, 9600);

        if(fd == -1){
            return "{'success':'false','err':'Can not open Serial Connection to IR-Device'}";
        }

        //reset the IR-Device
        serialPrintf(fd,":~:");
        delay(20);

        //send code to IR-Device
        serialPrintf(fd,"v:");
        delay(100);

        string erg = "";

        while (serialDataAvail (fd))
        {
            erg += serialGetchar (fd);
        }

        return erg;
     }
};


/**
 *  tell the compiler that the get_module is a pure C function
 */
extern "C" {

    /**
     *  Function that is called by PHP right after the PHP process
     *  has started, and that returns an address of an internal PHP
     *  strucure with all the details and features of your extension
     *
     *  @return void*   a pointer to an address that is understood by PHP
     */
    PHPCPP_EXPORT void *get_module()
    {
        // static(!) Php::Extension object that should stay in memory
        // for the entire duration of the process (that's why it's static)
        static Php::Extension extension("IR", "1.0");

        Php::Class<IR> ir("IR");
        ir.method<&IR::send> ("send", {
            Php::ByVal("code", Php::Type::String),
            Php::ByVal("times", Php::Type::Numeric)
        });

        ir.method<&IR::read> ("read",{
            Php::ByVal("mode", Php::Type::Numeric)
        });

        ir.method<&IR::getMode> ("getMode");

        // add the class to the extension
        extension.add(std::move(ir));

        // return the extension
        return extension;
    }
}