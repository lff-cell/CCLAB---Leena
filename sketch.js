// sketch.js
let planets;
let currentPlanet;
let score = 0;
let days = 1;
let resources = 50;
let explorationSpeed = 5;

// New variables for pixel manipulation
let pixelManipulated = false;

// New variables for simulation
let sunSize = 50;
let sunColor = 255;

// New variables for interactive audio visualization
let audio;
let amplitude;

function preload() {
  // Load audio file for interactive audio visualization
  audio = loadSound('offgun.mp3'); // Replace 'your-audio-file.mp3' with 'offgun.mp3'
}

function setup() {
  createCanvas(800, 600);
  planets = [
    { name: "Mercury", quiz: { question: "What is the smallest planet in our solar system?", options: ["Venus", "Earth", "Mercury", "Mars"], correctAnswer: "Mercury" } },
    { name: "Venus", quiz: { question: "Which planet is known as the 'Evening Star'?", options: ["Mercury", "Venus", "Mars", "Jupiter"], correctAnswer: "Venus" } },
    { name: "Earth", quiz: { question: "What is the only planet known to support life?", options: ["Mars", "Earth", "Jupiter", "Saturn"], correctAnswer: "Earth" } },
    { name: "Mars", quiz: { question: "Which planet is often called the 'Red Planet'?", options: ["Mars", "Jupiter", "Venus", "Uranus"], correctAnswer: "Mars" } },
    // Add more planets with quiz questions
  ];
  currentPlanet = getRandomPlanet();

  // Initialize audio amplitude for visualization
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0); // Set background to black

  // Simulate exploration speed based on the slider value
  frameRate(explorationSpeed);

  // Pixel manipulation
  if (pixelManipulated) {
    manipulatePixels();
  }

  // Simulation
  simulateSun();

  // Interactive audio visualization
  visualizeAudio();

  // Display current planet and quiz
  displayPlanet();
  displayStats();
  handleHover();
}

function mousePressed() {
  // Check if the mouse is over the "Explore" button
  if (mouseX >= 20 && mouseX <= 120 && mouseY >= 250 && mouseY <= 290) {
    initiateQuiz();
    // Trigger pixel manipulation on quiz initiation
    pixelManipulated = true;
    // Play the loaded audio file
    audio.play();
  }
}

function initiateQuiz() {
  let answer = window.prompt(currentPlanet.quiz.question + "\nOptions: " + currentPlanet.quiz.options.join(", "));
  
  if (answer && answer.toLowerCase() === currentPlanet.quiz.correctAnswer.toLowerCase()) {
    score += 10;
    resources += 20;
    currentPlanet = getRandomPlanet(); // Move to the next planet
  } else {
    resources -= 10;
  }

  days++;
}

function manipulatePixels() {
  // Manipulate pixels (example: invert colors)
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 - pixels[i]; // Red
    pixels[i + 1] = 255 - pixels[i + 1]; // Green
    pixels[i + 2] = 255 - pixels[i + 2]; // Blue
  }
  updatePixels();
}

function simulateSun() {
  // Simulate a simple sun animation
  fill(sunColor, sunColor, 0);
  ellipse(width - 100, 100, sunSize, sunSize);
  sunSize += 0.5;
  sunColor -= 0.2;
}

function visualizeAudio() {
  // Get the current volume of the audio
  let level = amplitude.getLevel();
  let circleSize = map(level, 0, 1, 10, 200);

  // Draw an interactive audio visualization
  fill(0, 0, 255);
  ellipse(width / 2, height / 2, circleSize, circleSize);
}

function getRandomPlanet() {
  return random(planets);
}

function displayPlanet() {
  // Display the current planet and quiz
  textSize(24);
  fill(255);
  textAlign(CENTER);
  text("Current Planet: " + currentPlanet.name, width / 2, 50);
  textSize(18);
  text("Quiz: " + currentPlanet.quiz.question, width / 2, 100);
}

function displayStats() {
  // Display the player's score, days spent exploring, and current resources
  textSize(18);
  fill(255);
  textAlign(LEFT);
  text("Score: " + score, 20, 20);
  text("Days Spent Exploring: " + days, 20, 50);
  text("Current Resources: " + resources, 20, 80);
}

function handleHover() {
  // Change the background color when hovering over the "Explore" button
  if (mouseX >= 20 && mouseX <= 120 && mouseY >= 250 && mouseY <= 290) {
    document.getElementById("controls").style.backgroundColor = "#8cf58c";
  } else {
    document.getElementById("controls").style.backgroundColor = "#f0f0f0";
  }
}

document.getElementById("speed-slider").addEventListener("input", function () {
  // Update exploration speed based on the slider value
  explorationSpeed = this.value;
  document.getElementById("speed-value").innerText = "Speed: " + explorationSpeed;
});
