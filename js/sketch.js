let gestures_results;
let cam = null;
let p5canvas = null;
var randomColor = [];
var thisColor;
var current;
var instruments;
var current_note = 0;
var current_gesture = "nothing";
var currentHeightLevel = 0;
var pos = {x:0,y:0};

function setup() {
  randomColor.push(color(255,255,255), color(255,0,0), color(0,255,0), color(0,0,255), color(255,255,0), color(0,255,255), color(255,0,255), color(192,192,192));
  p5canvas = createCanvas(640, 480);
  p5canvas.parent('#canvas');
  // When gestures are found, the following function is called. The detection results are stored in results.
  gotGestures = function (results) {
    gestures_results = results;
  }
  instruments = SampleLibrary.load({
    instruments: ["violin","flute"], ext: ".wav", baseUrl: "samples/"
  });

  Tone.Buffer.on('load', function() {
  current = instruments["violin"];
  current.toMaster();
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
      //let score = gestures_results.gestures[i][0].score;
      let tempHand = gestures_results.handednesses[i][0].displayName;
      let right_or_left = tempHand === "Left" ? "Right" : "Left";
      pos = {
        x: gestures_results.landmarks[i][0].x * width,
        y: gestures_results.landmarks[i][0].y * height,
      };
      //text overlay and coloring
      switch (name)
      {
        case "Pointing_Up": 
          fill(thisColor);
          stroke(255);
          break;
      }
      textSize(48);
      textAlign(CENTER, CENTER);
      //text(gestures_results.handednesses[i][0].hand, pos.x, pos.y);
      text(pos.y, pos.x, pos.y+20);

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
        }
      }
      
      if (currentHeightLevel != floor(10-(pos.y-50)/(height/11)))
      {
        currentHeightLevel = floor(10-(pos.y-50)/(height/11));
        //determine left hand or right hand, then whether to cutoff the previous wav
        //if   (current == instruments["violin"])
        current.triggerRelease(Tone.Frequency(current_note, "midi").toNote());
        switch (currentHeightLevel) 
        {
          case 0:
            current_note = 72;
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case 1:
            current_note = 74;
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case 2:
            current_note = 76;
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case 3:
            current_note = 77;
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case 4:
            current_note = 79;
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case 5:
            current_note = 81;
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case 6:
            current_note = 83;
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case 7:
            current_note = 84;
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          default:
            current.triggerRelease(Tone.Frequency(current_note, "midi").toNote());
            break;
        }
      }    
    }
    if ((gestures_results.gestures.length == 0) && (current)) current.triggerRelease(Tone.Frequency(current_note, "midi").toNote());
  }
}
