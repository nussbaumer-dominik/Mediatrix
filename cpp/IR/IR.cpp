#include <wiringPi.h>
#include <wiringSerial.h>
#include <iostream>
#include <string>
#include <cerrno>
#include <sstream>

#include <phpcpp.h>

using namespace std;

class IR: public Php::Base {
    public:
     static Php::Value send(Php::Parameters &params){

        string timesStr = params[1];
        int times = params[1];

        if(timesStr.length()==1){
            timesStr = "0"+timesStr;
        }

        //open serial connection to IR-Device
        int fd = serialOpen("/dev/ttyUSB0", 9600);

        if(fd == -1){
            return "{'success':'false','err':'Can not open Serial Connection to IR-Device'}";
        }

        //reset the IR-Device
        serialPrintf(fd,":~:");
        delay(20);

        //convert given code to string
        string code = params[0];

        //send code to IR-Device
        serialPrintf(fd,("p"+code+"]:").c_str());
        delay(20);

        std::cout << ("w"+timesStr+":").c_str() << endl;

        //send amount of repetitions of the code to the IR-Device
        serialPrintf(fd, ("w"+timesStr+":").c_str());
        delay(150*times);

        return "{'success':'true','err':''}";
     }

     static Php::Value read(){

     }
}


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
        ir.method<&IR::send> ("send", {Php::ByVal("codes", Php::Type::Array)});
        ir.method<&IR::read> ("read");
        
        // return the extension
        return extension;
    }
}
