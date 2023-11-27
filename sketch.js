// sketch.js
let planets;
let currentPlanet;
let score = 0;
let days = 1;
let resources = 50;
let explorationSpeed = 5;

let pixelManipulated = false;
let sunSize = 50;
let sunColor = 255;

let audio;
let amplitude;

function preload() {
  audio = loadSound('offgun.mp3');
}

function setup() {
  createCanvas(800, 600);
  planets = [
    { name: "Mercury", quiz: { question: "What is the smallest planet in our solar system?", options: ["Venus", "Earth", "Mercury", "Mars"], correctAnswer: "Mercury" } },
    { name: "Venus", quiz: { question: "Which planet is known as the 'Evening Star'?", options: ["Mercury", "Venus", "Mars", "Jupiter"], correctAnswer: "Venus" } },
    { name: "Earth", quiz: { question: "What is the only planet known to support life?", options: ["Mars", "Earth", "Jupiter", "Saturn"], correctAnswer: "Earth" } },
    { name: "Mars", quiz: { question: "Which planet is often called the 'Red Planet'?", options: ["Mars", "Jupiter", "Venus", "Uranus"], correctAnswer: "Mars" } },
    { name: "Jupiter", quiz: { question: "Which planet is the largest in our solar system?", options: ["Saturn", "Mars", "Earth", "Jupiter"], correctAnswer: "Jupiter" } },
    { name: "Saturn", quiz: { question: "Which planet is known for its prominent ring system?", options: ["Saturn", "Neptune", "Uranus", "Pluto"], correctAnswer: "Saturn" } },
    // Add more planets with quiz questions
  ];
  currentPlanet = getRandomPlanet();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0);

  frameRate(explorationSpeed);

  if (pixelManipulated) {
    manipulatePixels();
  }

  simulateSun();

  visualizeAudio();

  displayPlanet();
  displayStats();
  handleHover();
}

function mousePressed() {
  if (mouseX >= 20 && mouseX <= 120 && mouseY >= 250 && mouseY <= 290) {
    initiateQuiz();
    pixelManipulated = true;
    audio.play();
  }
}

function initiateQuiz() {
  if (currentPlanet) {
    let answer = window.prompt(currentPlanet.quiz.question + "\nOptions: " + currentPlanet.quiz.options.join(", "));

    if (answer && answer.toLowerCase() === currentPlanet.quiz.correctAnswer.toLowerCase()) {
      score += 10;
      resources += 20;
      currentPlanet = getRandomPlanet();
    } else {
      resources -= 10;
    }

    days++;
  }
}

function manipulatePixels() {
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 - pixels[i]; // Red
    pixels[i + 1] = 255 - pixels[i + 1]; // Green
    pixels[i + 2] = 255 - pixels[i + 2]; // Blue
  }
  updatePixels();
}

function simulateSun() {
  fill(sunColor, sunColor, 0);
  ellipse(width - 100, 100, sunSize, sunSize);
  sunSize += 0.5;
  sunColor -= 0.2;
}

function visualizeAudio() {
  let level = amplitude.getLevel();
  let circleSize = map(level, 0, 1, 10, 200);
  fill(0, 0, 255);
  ellipse(width / 2, height / 2, circleSize, circleSize);
}

function getRandomPlanet() {
  return random(planets);
}

function displayPlanet() {
  textSize(24);
  fill(255);
  textAlign(CENTER, TOP);
  text(currentPlanet.name, width / 2, 10);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(currentPlanet.quiz.question, width / 2, height / 2);
}

function displayStats() {
  textSize(18);
  fill(255);
  text("Score: " + score, 20, 20);
  text("Days Spent Exploring: " + days, 20, 50);
  text("Current Resources: " + resources, 20, 80);
}

function handleHover() {
  if (mouseX >= 20 && mouseX <= 120 && mouseY >= 250 && mouseY <= 290) {
    document.getElementById("controls").style.backgroundColor = "#8cf58c";
  } else {
    document.getElementById("controls").style.backgroundColor = "#f0f0f0";
  }
}