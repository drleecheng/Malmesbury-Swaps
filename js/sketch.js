let gestures_results;
let cam = null;
let p5canvas = null;
var melodyColor;
var chordColor;
var currentRight;
var currentLeft;
var instruments;
var currentLeftHandNote = 0;
var currentRightHandNote = 0;
var leftHandGesture = "nothing";
var rightHandGesture = "nothing";
var currentRightHandLevel = 0;
var currentLeftHandLevel = 0;
var posLeftHand = {x:0,y:0};
var posRightHand = {x:0,y:0};
var pianoC;
var pianoE;
var pianoG;

function setup() {
  let aspectRatio = 4 / 3;
  if (windowWidth > windowHeight)
    p5canvas = createCanvas(windowHeight * aspectRatio, windowHeight);
  else
    p5canvas = createCanvas(windowWidth, windowWidth * aspectRatio);
  p5canvas.parent('#canvas');
  // When gestures are found, the following function is called. The detection results are stored in results.
  gotGestures = function (results) {
    gestures_results = results;
  }
  instruments = SampleLibrary.load({
    instruments: ["violin","flute"], ext: ".wav", baseUrl: "samples/"
  });

  Tone.Buffer.on('load', function() {
  currentRight = instruments["violin"];
  currentRight.toMaster();
  currentLeft = instruments["flute"];
  currentLeft.toMaster();
  });
  pianoC = new Tone.Player("samples/piano/C3.wav").toMaster();
  pianoE = new Tone.Player("samples/piano/E3.wav").toMaster();
  pianoG = new Tone.Player("samples/piano/G3.wav").toMaster();
  
  melodyColor = color(0, 255, 0);
  chordColor = color(255, 0, 0);
}

function windowResized() {
  let aspectRatio = 4 / 3;
  if (windowWidth > windowHeight)
    resizeCanvas(windowHeight * aspectRatio, windowHeight);
  else
    resizeCanvas(windowWidth, windowWidth * aspectRatio);
}

function startWebcam() {
  // If the function setCameraStreamToMediaPipe is defined in the window object, the camera stream is set to MediaPipe.
  if (window.setCameraStreamToMediaPipe) {
    cam = createCapture(VIDEO);
    cam.hide();
    cam.elt.onloadedmetadata = function () {
      window.setCameraStreamToMediaPipe(cam.elt);
    }
    //p5canvas.style('max-width', '1024px');
    //p5canvas.style('max-height', '75%');
  }
  
}

function draw() 
{
  background(128);
  if (cam) {
    image(cam, 0, 0, width, height);
  }
  // https://developers.google.com/mediapipe/solutions/vision/hand_landmarker
  if (gestures_results) {
    // determine whether it's left or right hand
    // store the single position to posLeftHand or posRightHand
    for (let i = 0; i < gestures_results.gestures.length; i++) 
    {
      let name = gestures_results.gestures[i][0].categoryName;
      let tempHand = gestures_results.handednesses[i][0].displayName;
      let right_or_left = tempHand === "Left" ? "Left" : "Right";
      if (right_or_left == "Left")
        posLeftHand = {
          x: gestures_results.landmarks[i][0].x * width,
          y: gestures_results.landmarks[i][0].y * height,
        };
      else 
        posRightHand = {
          x: gestures_results.landmarks[i][0].x * width,
          y: gestures_results.landmarks[i][0].y * height,
        };
      //text overlay and coloring
      switch (name)
      {
        case "Pointing_Up": 
          fill(melodyColor);
          stroke(255);
           if (right_or_left == "Left")
            leftHandGesture = "Pointing_Up";
          else 
            rightHandGesture = "Pointing_Up";
          break;
        case "Closed_Fist": 
          fill(chordColor);
          stroke(255);
           if (right_or_left == "Left")
            leftHandGesture = "Closed_Fist";
          else 
            rightHandGesture = "Closed_Fist";
          break;
      }

      //point colors
      if (gestures_results.landmarks) {
        for (const landmarks of gestures_results.landmarks) {
          for (let landmark of landmarks) {
            stroke(255);
            strokeWeight(2);
            switch (name)
            {
                case "Pointing_Up": 
                  fill(melodyColor);
                break;
                case "Closed_Fist": 
                  fill(chordColor);
                break;
            }
            circle(landmark.x * width, landmark.y * height, 10);
          }
        textSize(48);
        textAlign(CENTER, CENTER);
        }
      }

      //make sound
      switch (name)
      {
        case "Pointing_Up":
          if (currentRightHandLevel != floor(10-(posRightHand.y-50)/(height/11)))
            if (rightHandGesture = "Pointing_Up")
            {
              currentRightHandLevel = floor(10-(posRightHand.y-50)/(height/11));
              currentRight.triggerRelease(Tone.Frequency(currentRightHandNote, "midi").toNote());
              switch (currentRightHandLevel) 
              {
                case 0:
                  currentRightHandNote = 72;
                  break;
                case 1:
                  currentRightHandNote = 74;
                  break;
                case 2:
                  currentRightHandNote = 76;
                  break;
                case 3:
                  currentRightHandNote = 77;
                  break;
                case 4:
                  currentRightHandNote = 79;
                  break;
                case 5:
                  currentRightHandNote = 81;
                  break;
                case 6:
                  currentRightHandNote = 83;
                  break;
                case 7:
                  currentRightHandNote = 84;
                  break;
                default:
                  break;
              }
              currentRight.triggerAttack(Tone.Frequency(currentRightHandNote, "midi").toNote());
            }    
            else if (leftHandGesture = "Pointing_Up")
            {
              currentLeftHandLevel = floor(10-(posLeftHand.y-50)/(height/11));
              currentLeft.triggerRelease(Tone.Frequency(currentLeftHandNote, "midi").toNote());
              switch (currentLeftHandLevel) 
              {
                case 0:
                  currentLeftHandNote = 72;
                  break;
                case 1:
                  currentLeftHandNote = 74;
                  break;
                case 2:
                  currentLeftHandNote = 76;
                  break;
                case 3:
                  currentLeftHandNote = 77;
                  break;
                case 4:
                  currentLeftHandNote = 79;
                  break;
                case 5:
                  currentLeftHandNote = 81;
                  break;
                case 6:
                  currentLeftHandNote = 83;
                  break;
                case 7:
                  currentLeftHandNote = 84;
                  break;
                default:
                  break;
              }
              currentLeft.triggerAttack(Tone.Frequency(currentLeftHandNote, "midi").toNote());
            }    
          break;
          /*
        case "Closed_Fist": 
          if (rightHandGgesture != "Closed_Fist")
          {
            pianoC.start();
            pianoE.start();
            pianoG.start();
          }
          else if (leftHandGgesture != "Closed_Fist")
          {
            pianoC.start();
            pianoE.start();
            pianoG.start();
          }
            leftHandGgesture = "Closed_Fist";
          break;*/
        default:
            leftHandGgesture = "None";
            rightHandGgesture = "None";
        break;
      }
    }
    if (rightHandGgesture == "None") 
    {
      currentRight.triggerRelease(Tone.Frequency(currentRightHandNote, "midi").toNote());
    }
    if (leftHandGgesture == "None") 
    {
      currentLeft.triggerRelease(Tone.Frequency(currentLeftHandNote, "midi").toNote());
    }
  }
  rightHandGgesture = "None";
  leftHandGgesture = "None";
}
