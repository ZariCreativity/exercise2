int RGB_Answer = 3;

int LED_R = 5;
int LED_G = 6;
int LED_B = 9;

int RGB_2_R = 0;
int RGB_2_G = 0;
int RGB_2_B = 0;

int control = -1;
int brightness = 0;

void setup() {
  // put your setup code here, to run once:

  //RGB_Answer output
  pinMode(RGB_Answer, OUTPUT);

  //outputs for the individual LEDs
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);

  //Serial in/output
  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:

  delay(5);
  String msg = Serial.readStringUntil('\n'); //read until the newline symbol

  if(msg != ""){
    Serial.println("The brightness is " + msg); //FEEDBACK LINE
    brightness = msg.toInt(); //converts msg from String to int
    analogWrite(LED_R, brightness); //Just testing out RED
    analogWrite(11, brightness); //RGB
  }
  

}
