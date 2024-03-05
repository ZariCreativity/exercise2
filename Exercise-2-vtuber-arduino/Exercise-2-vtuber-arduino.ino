//PIN Numbers
const int RGB_RED_PIN = 3;
const int RGB_GREEN_PIN = 5;
const int RGB_BLUE_PIN = 6;
const int IDLE_BTN = 2;
const int HAPPY_BTN = 4;
const int SAD_BTN = 7;
const int BUZZER_PIN = 9;
const int DELAY_MS = 5;

//Variables for RGB values
int redVal = 0;
int greenVal = 0;
int blueVal = 0;

//Buzzer volume
int buzzerVal = 0;

//Emotion descriptions
String idleEmote = "IDLE";
String happyEmote = "HAPPY";
String sadEmote = "SAD";
String currentEmote = idleEmote;

float brightnessFraction = 1.0;

void setup() {
  Serial.begin(9600); // Starts the serial communication

  pinMode(RGB_RED_PIN, OUTPUT); // Sets the red pin as an Output
  pinMode(RGB_GREEN_PIN, OUTPUT); // Sets the green pin as an Output
  pinMode(RGB_BLUE_PIN, OUTPUT); // Sets the blue pin as an Output

  pinMode(BUZZER_PIN, OUTPUT); // Buzzer output
  
  pinMode(IDLE_BTN, INPUT_PULLUP); // IDLE button input
  pinMode(HAPPY_BTN, INPUT_PULLUP); // HAPPY button input
  pinMode(SAD_BTN, INPUT_PULLUP); // SAD button input
  


}

void loop() {
  // Read color and brightness data from the serial
  if(Serial.available() > 0){
    // If we are here, then serial data has been received
    // Read data off the serial port until we get ot the endline delimeter ('\n')
    String rcvdSerialData = Serial.readStringUntil('\n');

    // Parse the comma separated string
    int startIndex = 0;
    int endIndex = rcvdSerialData.indexOf(','); // find first index of comma in the string

    if(endIndex != -1){

      // Parse out the first color value - red
      String strRedVal = rcvdSerialData.substring(startIndex, endIndex);
      redVal = strRedVal.toInt();

      // Parse out the second color value - green
      startIndex = endIndex + 1;
      endIndex = rcvdSerialData.indexOf(',', startIndex);
      String strGreenVal = rcvdSerialData.substring(startIndex, endIndex);
      greenVal = strGreenVal.toInt();

      // Parse out the third color value - blue
      startIndex = endIndex + 1;
      endIndex = rcvdSerialData.indexOf(',', startIndex);
      String strBlueVal = rcvdSerialData.substring(startIndex, endIndex);
      blueVal = strBlueVal.toInt();

      // Parse out the brightness fraction
      startIndex = endIndex + 1;
      endIndex = rcvdSerialData.indexOf(',', startIndex);
      String strBrightnessFraction = rcvdSerialData.substring(startIndex, endIndex);
      brightnessFraction = strBrightnessFraction.toFloat();

      // Parse out the buzzer sound
      startIndex = endIndex + 1;
      endIndex = rcvdSerialData.indexOf(',', startIndex);
      String strBuzzerVal = rcvdSerialData.substring(startIndex, endIndex);
      buzzerVal = strBuzzerVal.toInt();

      // Set the RGB led with the read red, green, and blue color
      setRGBLedColorAndBrightness(redVal, greenVal, blueVal, brightnessFraction);

      setBuzzer(buzzerVal);
    }
  }

  //set current emotion
  setCurrentEmotion();

  delay(DELAY_MS);
}

//FUNCTION SETS LED COLOR----------------------------------------------------------------
void setRGBLedColorAndBrightness(int red, int green, int blue, float brightness_fraction){
  int r_real = red * brightness_fraction;
  int g_real = green * brightness_fraction;
  int b_real = blue * brightness_fraction;

  analogWrite(RGB_RED_PIN, r_real);
  analogWrite(RGB_GREEN_PIN, g_real);
  analogWrite(RGB_BLUE_PIN, b_real);
}

//SETS BUZZER VOLUME--------------------------------------------------------------------
void setBuzzer(int volume){
  analogWrite(BUZZER_PIN, volume);
}


//SETS EMOTION--------------------------------------------------------------------------
void setCurrentEmotion(){
  //Idle Emotion Button
  if(digitalRead(IDLE_BTN) == LOW){
    currentEmote = idleEmote;
    Serial.println("Current Emotion: " + currentEmote);
  }

  //Happy Emotion Button
  if(digitalRead(HAPPY_BTN) == LOW){
    currentEmote = happyEmote;
    Serial.println("Current Emotion: " + currentEmote);
  }

  //Sad Emotion Button 
  if(digitalRead(SAD_BTN) == LOW){
    currentEmote = sadEmote;
    Serial.println("Current Emotion: " + currentEmote);
  }

  else {
    Serial.println("Current Emotion: " + currentEmote);
  }
}
