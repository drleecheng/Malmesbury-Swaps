let gestures_results;
let cam = null;
let p5canvas = null;
var currentRight;
var currentLeft;
var isRightHandPlaying = false;
var isLeftHandPlaying = false;
var instruments;
var currentLeftHandNote = 0;
var currentRightHandNote = 0;
var currentGesture;
var previousLeftHandGesture = "None";
var previousRightHandGesture = "None";
var leftHandGesture = "None";
var rightHandGesture = "None";
var currentRightHandLevel = 0;
var currentLeftHandLevel = 0;
var posLeftHand = {x:0,y:0};
var posRightHand = {x:0,y:0};
var pianoC;
var pianoE;
var pianoG;
var pianoB;
var pianoD;

function setup() {
  // fitting the canvas according to the window's size
  let targetRatio = 16 / 9;
  let w = windowWidth;
  let h = windowHeight;

  if (windowWidth / windowHeight > targetRatio) {
    w = windowHeight * targetRatio;
  } else {
    h = windowWidth / targetRatio;
  }

  p5canvas = createCanvas(w * 0.95, h * 0.95); 
  p5canvas.parent('#canvas');
  let body = select('body');
  body.style('margin', '0');
  body.style('overflow', 'hidden');
  p5canvas.style('display', 'block');
  p5canvas.style('margin', 'auto');
  let container = select('#canvas');
  container.style('height', '100vh');
  container.style('display', 'flex');
  container.style('align-items', 'center');

  // When gestures are found, the following function is called. The detection results are stored in results.
  gotGestures = function (results) {
    gestures_results = results;
  }
  instruments = SampleLibrary.load({
    instruments: ["violin","flute"], ext: ".wav", baseUrl: "samples/"
  });

  // Setting up the sound libraries
  Tone.Buffer.on('load', function() {
  currentRight = instruments["violin"];
  currentRight.toMaster();
  currentLeft = instruments["flute"];
  currentLeft.toMaster();
  });
  pianoC = new Tone.Player("samples/piano/C3.wav").toMaster();
  pianoE = new Tone.Player("samples/piano/E3.wav").toMaster();
  pianoG = new Tone.Player("samples/piano/G3.wav").toMaster();
  pianoB = new Tone.Player("samples/piano/B3.wav").toMaster();
  pianoD = new Tone.Player("samples/piano/D4.wav").toMaster();
}

function windowResized() {
// Repeat the logic here so it stays fixed when rotating/resizing
  let targetRatio = 16 / 9;
  let w = (windowWidth / windowHeight > targetRatio) ? windowHeight * targetRatio : windowWidth;
  let h = (windowWidth / windowHeight > targetRatio) ? windowHeight : windowWidth / targetRatio;
  
  resizeCanvas(w * 0.95, h * 0.95);
}

function startWebcam() {
  // If the function setCameraStreamToMediaPipe is defined in the window object, 
  // the camera stream is set to MediaPipe.
  if (window.setCameraStreamToMediaPipe) {
    let constraints = {
      video: {
        aspectRatio: 16 / 9,
        facingMode: "user"
      },
      audio: false
    };cam = createCapture(constraints);
    cam.hide();
    cam.elt.onloadedmetadata = () => {
      if (cam.elt.videoWidth > 0 && cam.elt.videoHeight > 0) {
        window.setCameraStreamToMediaPipe(cam.elt);
        console.log("Camera connected to MediaPipe");
      }
    };
  }
}

function DetermineGesture(i) {
  // determine currentGesture
  // https://developers.google.com/mediapipe/solutions/vision/hand_landmarker
  currentGesture = gestures_results.gestures[i][0].categoryName;
  // determine whether it's left or right hand
  // store the single position to posLeftHand or posRightHand
  let tempHand = gestures_results.handednesses[i][0].displayName;
  let currentHand = tempHand === "Left" ? "Left" : "Right";
  if (currentHand == "Left")
  {
    posLeftHand = 
    {
      x: gestures_results.landmarks[i][0].x * width,
      y: gestures_results.landmarks[i][0].y * height,
    };
    isLeftHandPlaying = true;
    switch (currentGesture)
    {
    case "Pointing_Up": 
        leftHandGesture = "Pointing_Up";
      break;
    case "Closed_Fist": 
        leftHandGesture = "Closed_Fist";
      break;
    case "Open_Palm": 
        leftHandGesture = "Open_Palm";
      break;
    default:
        leftHandGesture = "None";
      break;
    }
  }
  else 
  {
    posRightHand = {
      x: gestures_results.landmarks[i][0].x * width,
      y: gestures_results.landmarks[i][0].y * height,
    };
    isRightHandPlaying = true;
    switch (currentGesture)
    {
    case "Pointing_Up": 
        rightHandGesture = "Pointing_Up";
      break;
    case "Closed_Fist": 
        rightHandGesture = "Closed_Fist";
      break;
    case "Open_Palm": 
        rightHandGesture = "Open_Palm";
      break;
    default:
        rightHandGesture = "None";
      break;
    }
  }
}

function PrintLandmarkPoints() 
{
  for (const landmarks of gestures_results.landmarks) {
    for (let landmark of landmarks) {
      stroke(255);
      strokeWeight(2);
      fill(color(0, 255, 0));
      circle(landmark.x * width, landmark.y * height, 10);
    }
  }
}

function PlayRightHandGesture()
{
  switch (rightHandGesture)
  {
    case "Pointing_Up":
      if ((previousRightHandGesture != "Pointing_Up") || (currentRightHandLevel != floor(10-(posRightHand.y-50)/(height/11))))
      {
        currentRight.triggerRelease(Tone.Frequency(currentRightHandNote, "midi").toNote());
        currentRightHandLevel = floor(10-(posRightHand.y-50)/(height/11));
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
            currentRight.triggerRelease(Tone.Frequency(currentRightHandNote, "midi").toNote());
            break;
        }
        currentRight.triggerAttack(Tone.Frequency(currentRightHandNote, "midi").toNote());
        previousRightHandGesture = "Pointing_Up";
        rightHandGesture = "None";
      } 
      break;
    case "Closed_Fist":
      if (previousRightHandGesture != "Closed_Fist")
      {
        pianoC.start();
        pianoE.start();
        pianoG.start();
        previousRightHandGesture = "Closed_Fist";
      }
      break;
    case "Open_Palm":
      if (previousRightHandGesture != "Open_Palm")
      {
        pianoG.start();
        pianoB.start();
        pianoD.start();
        previousRightHandGesture = "Open_Palm";
      }
      break;
    case "None":
      previousRightHandGesture = "None";
      break;
    default:
      break;
  }
}

function PlayLeftHandGesture()
{
  switch (leftHandGesture)
  {
    case "Pointing_Up":
      if ((previousLeftHandGesture != "Pointing_Up") || (currentLeftHandLevel != floor(10-(posLeftHand.y-50)/(height/11))))
      {
        currentLeft.triggerRelease(Tone.Frequency(currentLeftHandNote, "midi").toNote());
        currentLeftHandLevel = floor(10-(posLeftHand.y-50)/(height/11));
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
            currentRight.triggerRelease(Tone.Frequency(currentRightHandNote, "midi").toNote());
            break;
        }
        currentLeft.triggerAttack(Tone.Frequency(currentLeftHandNote, "midi").toNote());
        previousLeftHandGesture = "Pointing_Up";
        leftHandGesture = "None";
      } 
      break;
    case "Closed_Fist":
      if (previousLeftHandGesture != "Closed_Fist")
      {
        pianoC.start();
        pianoE.start();
        pianoG.start();
        previousLeftHandGesture = "Closed_Fist";
      }
      break;
    case "Open_Palm":
      if (previousLeftHandGesture != "Open_Palm")
      {
        pianoG.start();
        pianoB.start();
        pianoD.start();
        previousLeftHandGesture = "Open_Palm";
      }
      break;
    case "None":
      previousLeftHandGesture = "None";
      break;
    default:
      break;
  }
}

function ReleaseRemainingNotes()
{
  // If hand is out of sight, stop the sound
  if (isLeftHandPlaying == false)
  {
    if (currentLeft) 
      currentLeft.triggerRelease(Tone.Frequency(currentLeftHandNote, "midi").toNote());
  }
  else
    isLeftHandPlaying = false;
  if (isRightHandPlaying == false)
  {
    if (currentRight) 
      currentRight.triggerRelease(Tone.Frequency(currentRightHandNote, "midi").toNote());
  }
    else
      isRightHandPlaying = false;
}

function draw() 
{
  if (cam) 
  { 
    image(cam, 0, 0, width, height); 
  }
  if (gestures_results) {
    for (let i = 0; i < gestures_results.gestures.length; i++) 
    {
      DetermineGesture(i);
      PrintLandmarkPoints();
    }
    PlayRightHandGesture();
    PlayLeftHandGesture();
  }
  ReleaseRemainingNotes();
}

