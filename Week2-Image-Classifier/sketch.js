let classifier
let labelSpan
let confidenceSpan
let clearButton
let canvas
let item

let items = ["hand", "rabbit", "mouse", "strawberry", "mouth"]

function preload() {
  classifier = ml5.imageClassifier('DoodleNet');
}

function setup() {
  canvas =  createCanvas(300, 300)
  background(255);
  classifier.classify(canvas, gotResult);

  clearButton = select("#clearBtn");
  clearButton.mousePressed(clearCanvas);

  labelSpan = select("#label");
  confidenceSpan = select("#confidence");
}


function clearCanvas() {
  background(255);
}

function draw() {
  strokeWeight(16);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  labelSpan.html(results[0].label);
  confidenceSpan.html(floor(100 * results[0].confidence));
  classifier.classify(canvas, gotResult);
}


