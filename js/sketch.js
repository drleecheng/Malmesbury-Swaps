let gestures_results;
let cam = null;
let p5canvas = null;
var current;
var instruments;
var current_note = 0;
var current_gesture = "nothing";
var pos = {x:0,y:0};

function setup() {
  
  p5canvas = createCanvas(640, 480);
  p5canvas.parent('#canvas');
  // When gestures are found, the following function is called. The detection results are stored in results.
  gotGestures = function (results) {
    gestures_results = results;
  }
  instruments = SampleLibrary.load({
    instruments: ["violin"/*,"flute"*/], ext: ".wav", baseUrl: "samples/"
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

function draw() {
  background(128);
  if (cam) {
    image(cam, 0, 0, width, height);
  }
  // 各頂点座標を表示する
  // 各頂点座標の位置と番号の対応は以下のURLを確認
  // https://developers.google.com/mediapipe/solutions/vision/hand_landmarker
  if (gestures_results) {

    // ジェスチャーの結果を表示する
    for (let i = 0; i < gestures_results.gestures.length; i++) {
      noStroke();
      fill(255, 0, 0);
      textSize(20);
      let name = gestures_results.gestures[i][0].categoryName;
      let score = gestures_results.gestures[i][0].score;
      let right_or_left = gestures_results.handednesses[i][0].hand;
      pos = {
        x: gestures_results.landmarks[i][0].x * width,
        y: gestures_results.landmarks[i][0].y * height,
      };
      stroke(255);
      switch (name)
      {
        case "Do": 
          fill(255,0,0);
          break;
        case "Re": 
          fill(255,127,0);
          break;
        case "Mi": 
          fill(255,255,0);
          break;
        case "Fa": 
          fill(0,255,0);
          break;
        case "So": 
          fill(0,0,255);
          break;
        case "La": 
          fill(75,0,130);
          break;
        case "Ti": 
          fill(148,0,211);
          break;
        case "none":
          fill(0, 0, 0);
          break;
      }
      textSize(48);
      textAlign(CENTER, CENTER);
      text(name, pos.x, pos.y);


    if (gestures_results.landmarks) {
      for (const landmarks of gestures_results.landmarks) {
        for (let landmark of landmarks) {
          stroke(255);
          strokeWeight(2);
          switch (name)
          {
            case "Do": 
              fill(255,0,0);
              break;
            case "Re": 
              fill(255,127,0);
              break;
            case "Mi": 
              fill(255,255,0);
              break;
            case "Fa": 
              fill(0,255,0);
              break;
            case "So": 
              fill(0,0,255);
              break;
            case "La": 
              fill(75,0,130);
              break;
            case "Ti": 
              fill(148,0,211);
              break;
            case "none":
              fill(0);
              break;
              
          }
          circle(landmark.x * width, landmark.y * height, 10);
        }
      }
    }

      if (current_gesture != name)
      {
        current_gesture = name;
        current.triggerRelease(Tone.Frequency(current_note, "midi").toNote());
        switch (current_gesture) {
          case "Do":
            console.log(pos.y);
            if (pos.y > height*2/3) {current_note = 60;}
            else if (pos.y < height/3) {current_note = 84;}
            else {current_note = 72;}
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case "Re":
            if (pos.y > height*2/3) {current_note = 62;}
            else if (pos.y < height/3) {current_note = 86;}
            else {current_note = 74;}
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case "Mi":
            if (pos.y > height*2/3) {current_note = 64;}
            else if (pos.y < height/3) {current_note = 88;}
            else {current_note = 76;}
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case "Fa":
            if (pos.y > height*2/3) {current_note = 65;}
            else if (pos.y < height/3) {current_note = 89;}
            else {current_note = 77;}
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case "So":
            if (pos.y > height*2/3) {current_note = 67;}
            else if (pos.y < height/3) {current_note = 91;}
            else {current_note = 79;}
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case "La":
            if (pos.y > height*2/3) {current_note = 69;}
            else if (pos.y < height/3) {current_note = 93;}
            else {current_note = 81;}
            current.triggerAttack(Tone.Frequency(current_note, "midi").toNote());
            break;
          case "Ti":
            if (pos.y > height*2/3) {current_note = 71;}
            else if (pos.y < height/3) {current_note = 95;}
            else {current_note = 83;}
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
