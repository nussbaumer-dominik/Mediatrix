#include <stdlib.h>
#include <unistd.h>
#include <ola/DmxBuffer.h>
#include <ola/Logging.h>
#include <ola/client/StreamingClient.h>
#include <iostream>

#include <map>

using namespace std;
class DMX {

    private:
        static const unsigned int UNIVERSE = 0; // UNIVERSE to use for sending data
    
    public: 
        static int sendChannel(map<int,int> channels ){
            ola::InitLogging(ola::OLA_LOG_WARN, ola::OLA_LOG_STDERR);
            ola::DmxBuffer buffer; // A DmxBuffer to hold the data.
            buffer.Blackout(); // Set all channels to 0

            
            // Create a new client.
            ola::client::StreamingClient ola_client(
            (ola::client::StreamingClient::Options()));

            // Setup the client, this connects to the server
            if (!ola_client.Setup()) {
                std::cerr << "Setup failed" << endl;
                exit(1);
            }

            
            for (auto const& x : channels)
            {
                
                buffer.SetChannel(x.first, x.second);
            }
            
            if (!ola_client.SendDmx(UNIVERSE, buffer)) {
                cout << "Send DMX failed" << endl;
                exit(1);
            }
        
        }

        static int blackout(){
            ola::InitLogging(ola::OLA_LOG_WARN, ola::OLA_LOG_STDERR);
            ola::DmxBuffer buffer; // A DmxBuffer to hold the data.
            buffer.Blackout(); // Set all channels to 0


            // Create a new client.
            ola::client::StreamingClient ola_client(
                (ola::client::StreamingClient::Options()));
    
            // Setup the client, this connects to the server
            if (!ola_client.Setup()) {
                std::cerr << "Setup failed" << endl;
                exit(1);
            }


            if (!ola_client.SendDmx(UNIVERSE, buffer)) {
                cout << "Send DMX failed" << endl;
                exit(1);
            }
        }

        static int noBlackout(){
            map <int, int> c; 

            for(int i = 0; i<=512; i++){
                c.insert(pair <int, int> (i, 255)); 
            }
            sendChannel(c);
        }
};

int main(int, char *[]){
    map <int, int> c;        // empty map container
    
    // insert elements in random order
    c.insert(pair <int, int> (1, 40));
    c.insert(pair <int, int> (2, 30));
    c.insert(pair <int, int> (3, 60));
    c.insert(pair <int, int> (4, 20));
    c.insert(pair <int, int> (5, 50));
    c.insert(pair <int, int> (6, 50)); 
    c.insert(pair <int, int> (7, 10));

    DMX::sendChannel(c);

    DMX::blackout();

    DMX::noBlackout();
}