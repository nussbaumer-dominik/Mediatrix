# Mediatrix

WS command structure (JSON):
```JSON 
{
"dmx":
  {
  "scheinwerfer1":
  {
    "id": 1,
    "hue": 255
  }
  "scheinwerfer2":
  {
    "id": 2,
    "rot":2,
    "gruen":255,
    "blau":100,
    "weis":255,
    "hue":10
  },
  "blackout":1,
  "noblackout":1      
  }
"beamer":
  {
   "on":1,
   "off":1,
   "source":1
  }
 "av":
  {
   "mode":1/2/3/4,
   "source":1/0
   "volume":255
  }
}
```
