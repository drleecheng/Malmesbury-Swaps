let gestures_results;
let cam = null;
let p5canvas = null;
var randomColor = [];
var thisColor;
var currentRight;
var currentLeft;
var instruments;
var currentLeftHandNote = 0;
var currentRightHandNote = 0;
var current_gesture = "nothing";
var currentRightHandLevel = 0;
var currentLeftHandLevel = 0;
var posLeftHand = {x:0,y:0};
var posRightHand = {x:0,y:0};
var isLeftHandTriggered = false;
var isRightHandTriggered = false;

function setup() {
  randomColor.push(color(255,0,0), color(0,255,0), color(0,0,255), color(255,255,0), color(0,255,255), color(255,0,255), color(192,192,192));
  let aspectRatio = 16 / 9;
  p5canvas = createCanvas(windowHeight * aspectRatio, windowHeight);
  p5canvas.parent('#canvas');
  // When gestures are found, the following function is called. The detection results are stored in results.
  gotGestures = function (results) {
    gestures_results = results;
  }
  instruments = SampleLibrary.load({
    instruments: ["violin","flute"], ext: ".wav", baseUrl: "samples/"
  });

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  Tone.Buffer.on('load', function() {
  currentRight = instruments["violin"];
  currentRight.toMaster();
  currentLeft = instruments["flute"];
  currentLeft.toMaster();
  });
}

function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
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
  // 各頂点座標を表示する
  // 各頂点座標の位置と番号の対応は以下のURLを確認
  // https://developers.google.com/mediapipe/solutions/vision/hand_landmarker
  if (gestures_results) {

    // ジェスチャーの結果を表示する
    for (let i = 0; i < gestures_results.gestures.length; i++) 
    {
      noStroke();
      noFill();
      textSize(20);
      //set the color
      if (i < randomColor.length)
      {
        thisColor = randomColor[i];
      }
      else
      {
        thisColor = randomColor[i%randomColor.length];
      }
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
          fill(thisColor);
          stroke(255);
           if (right_or_left == "Left")
            isLeftHandTriggered = true;
            else
            isRightHandTriggered = true;
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
                fill(thisColor);
                break;
            }
            circle(landmark.x * width, landmark.y * height, 10);
          }
        textSize(48);
        textAlign(CENTER, CENTER);
        //text(str(landmarks[0].y-landmarks[8].y), posRightHand.x, posRightHand.y); // range around 0.1-0.5
        }
      }
      
      if (isRightHandTriggered && currentRightHandLevel != floor(10-(posRightHand.y-50)/(height/11)))
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

      if (isLeftHandTriggered && currentLeftHandLevel != floor(10-(posLeftHand.y-50)/(height/11)))
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
    
    }
    if (!isRightHandTriggered) 
    {
      currentRight.triggerRelease(Tone.Frequency(currentRightHandNote, "midi").toNote());
    }
    if (!isLeftHandTriggered) 
    {
      currentLeft.triggerRelease(Tone.Frequency(currentLeftHandNote, "midi").toNote());
    }
  }
  isRightHandTriggered = false;
  isLeftHandTriggered = false;
}
