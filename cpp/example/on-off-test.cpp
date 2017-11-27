#include <stdlib.h>
#include <unistd.h>
#include <ola/DmxBuffer.h>
#include <ola/Logging.h>
#include <ola/client/StreamingClient.h>
#include <iostream>
using std::cout;
using std::endl;
int main(int, char *[]) {
 unsigned int universe = 0; // universe to use for sending data
 // turn on OLA logging
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
 // Send 100 frames to the server. Increment slot (channel) 0 each time a
 // frame is sent.
 for (unsigned int i = 0; i < 100; i++) {
 buffer.SetChannel(0, i);
 buffer.SetChannel(6, 255);
 if (!ola_client.SendDmx(universe, buffer)) {
 cout << "Send DMX failed" << endl;
 exit(1);
 }
 usleep(25000); // sleep for 25ms between frames.
 }
 return 0;
}
