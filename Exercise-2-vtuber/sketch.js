//MOST OF THE CODE BELOW WAS BORROWED FROM A DEMO SHOWN IN CLASS
//ADDITIONAL CODE WRITTEN BY AZARIA & LORRAINE IS LABLED AS "ADDITIONAL", "ALT", OR "ORIGINAL"
let pHtmlMsg;
let serialOptions = { baudRate: 9600  };
let serial;

//Video Camera Variables
let video;
let poseNet;
let currentPoses;

//RGB Variables
let r = 0;
let g = 0;
let b = 0;
let brightnessFraction = 1.0;

//Buzzer Volume/Intensity - ORIGINAL
let buzzer = 0;

function setup() {
  createCanvas(400, 400);

  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  // // If we have previously approved ports, attempt to connect with them
  // serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);

  // Add in a lil <p> element to provide messages. This is optional
  pHtmlMsg = createP("Click anywhere on this page to open the serial connection dialog");
  
  //CAMERA SET UP------------------------------------------------------------------------
  // Set up the poseNet with m5.js
  video = createCapture(VIDEO);
  video.hide(); // hide raw video (feel free to comment in/out to see effect)
  poseNet = ml5.poseNet(video); //call onPoseNetModelReady (from the ml5 library) when ready
  poseNet.on('pose', onPoseDetected); // call onPoseDetected when pose detected
}

function draw() {
  resizeCanvas(video.width, video.height); //ALT - we changed the width and height of the canvas to match that of the video
  background(220);

  //ADDITIONAL variables to assist with mapping face tracking
  let centerX = video.width/2;
  let centerY = video.height/2;

  //move image by the width of image to the left
  translate(video.width, 0);
  //then scale it by -1 in the x-axis to flip the image
  scale(-1, 1);

  image(video, 0, 0); // draw the video to the screen at 0,0

  //Point in the center of video - ORIGINAL
  stroke(255, 0, 0);
  strokeWeight(15);
  point(centerX,centerY);

  //ORIGINAL GUIDE BOXES to Assist with Mapping Face Tracking-------------------------------------
  //Green Box
  //top
  stroke(0, 255, 0);
  strokeWeight(5);  
  line(centerX - 50, centerY - 50, centerX + 50, centerY - 50);
  //bottom
  stroke(0, 255, 0);
  strokeWeight(5);  
  line(centerX - 50, centerY + 50, centerX + 50, centerY + 50);
  //left
  stroke(0, 255, 0);
  strokeWeight(5);  
  line(centerX - 50, centerY - 50, centerX - 50, centerY + 50);  
  //right
  stroke(0, 255, 0);
  strokeWeight(5);  
  line(centerX + 50, centerY - 50, centerX + 50, centerY + 50);

  //Yellow Box
  //top
  stroke(255, 255, 0);
  strokeWeight(5);  
  line(centerX - 100, centerY - 100, centerX + 100, centerY - 100);
  //bottom
  stroke(255, 255, 0);
  strokeWeight(5);  
  line(centerX - 100, centerY + 100, centerX + 100, centerY + 100);
  //left
  stroke(255, 255, 0);
  strokeWeight(5);  
  line(centerX - 100, centerY - 100, centerX - 100, centerY + 100);  
  //right
  stroke(255, 255, 0);
  strokeWeight(5);  
  line(centerX + 100, centerY - 100, centerX + 100, centerY + 100);

  //Red Box
  //top
  stroke(255, 0, 0);
  strokeWeight(5);  
  line(centerX - 200, centerY - 200, centerX + 200, centerY - 200);
  //bottom
  stroke(255, 0, 0);
  strokeWeight(5);  
  line(centerX - 200, centerY + 200, centerX + 200, centerY + 200);
  //left
  stroke(255, 0, 0);
  strokeWeight(5);  
  line(centerX - 200, centerY - 200, centerX - 200, centerY + 200);  
  //right
  stroke(255, 0, 0);
  strokeWeight(5);  
  line(centerX + 200, centerY - 200, centerX + 200, centerY + 200);
  //END OF ORIGINAL GUIDE BOXES----------------------------------------------------


  if(currentPoses){
    for(let human of currentPoses){


       //ORIGINAL COLOR CHANGING CODE------------------------------------
       if ((human.pose.nose.x > centerX - 50 && human.pose.nose.x < centerX + 50) &&
       (human.pose.nose.y > centerY - 50 && human.pose.nose.y < centerY + 50)) {
        //green
        r = 0;
        g = 255;
        b = 0;

        buzzer = 0;
      }

      else if ((human.pose.nose.x > centerX - 100 && human.pose.nose.x < centerX + 100) && 
      (human.pose.nose.y > centerY - 100 && human.pose.nose.y < centerY + 100)){
        //yellow
        r = 254;
        g = 255;
        b = 0;

        buzzer = 0;
      }

      else if ((human.pose.nose.x > centerX - 200 && human.pose.nose.x < centerX + 200) &&
      (human.pose.nose.y > centerY - 200 && human.pose.nose.y < centerY + 200)){
        // red
        r = 255;
        g = 0;
        b = 0;

        buzzer = 150; //It only buzzes if you're in the red
      }

      brightnessFraction = 0.5; //ORIGINAL DEFAULT BRIGHTNESS
      //END OF ORIGINAL COLOR CHANGING CODE-----------------------------------------------

      let ledStr = "rgba(" + r + "," + g + "," + b + "," + brightnessFraction + ")";
      fill(ledStr); 
      noStroke();
      circle(human.pose.nose.x, human.pose.nose.y, 40);
    }
  }

}

//Other Functions-------------------------------------------------------------------

//When a pose is detected on video
function onPoseDetected(poses) {
  // print("On new poses detected!");
  currentPoses = poses;
  if(currentPoses){
    let strHuman = " human";
    if(currentPoses.length > 1){
      strHuman += 's';
    }
    text("We found " + currentPoses.length + strHuman);

    //serialWriteLEDColorAndBrightness(r,g,b,brightnessFraction);  unlike the demo, we are not using this function
    serialWriteLEDColorAndBuzzer(r,g,b,brightnessFraction, buzzer); //ORIGINAL function
  }
}

/**
 * Callback function by serial.js when there is an error on web serial
 * 
 * @param {} eventSender 
 */
function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
  pHtmlMsg.html(error);
}

/**
 * Callback function by serial.js when web serial connection is opened
 * 
 * @param {} eventSender 
 */
function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
  pHtmlMsg.html("Serial connection opened successfully");
}

/**
 * Callback function by serial.js when web serial connection is closed
 * 
 * @param {} eventSender 
 */
function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
  pHtmlMsg.html("onSerialConnectionClosed");
}

/**
 * Callback function serial.js when new web serial data is received
 * 
 * @param {*} eventSender 
 * @param {String} newData new data received over serial
 */
function onSerialDataReceived(eventSender, newData) {
  console.log("onSerialDataReceived", newData);
  pHtmlMsg.html("onSerialDataReceived: " + newData);
}

/**
 * Called automatically by the browser through p5.js when mouse clicked
 */
function mouseClicked() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }
}

/**
 * Called automatically by the browser through p5.js when data sent to the serial
 *
function serialWriteLEDColorAndBrightness(red, green, blue, brightness){
  if(serial.isOpen()){
    let strData = red + "," + green + "," + blue + "," + nf(brightness,1,2);
    console.log(strData);
    serial.writeLine(strData);
  }
}
*/

//OUR ALT VERSION OF THE DEMO'S FUNCTION ABOVE--------------------------
/**
 * Called automatically by the browser through p5.js when data sent to the serial
 */
// buzzerVol is the intensity of the buzzer
function serialWriteLEDColorAndBuzzer(red, green, blue, brightness, buzzerVol){
  if(serial.isOpen()){
    let strData = red + "," + green + "," + blue + "," + nf(brightness,1,2) + "," + buzzerVol;
    console.log(strData);
    serial.writeLine(strData);
  }
}

