let planets;
let randomPlanet;
let score = 0;
let days = 1;
let resources = 50;
let explorationSpeed = 5;

// New variables for pixel manipulation
let pixelColor;
let pixelManipulated = false;

// New variables for simulation
let sunSize = 50;
let sunColor = 255;

// New variables for interactive audio visualization
let audio;
let amplitude;

function preload() {
  // Load audio file for interactive audio visualization
  audio = loadSound('offgun.mp3', function () {
    // Audio is loaded, you can now play it
    audio.play();
  });
}

function setup() {
  createCanvas(800, 600);
  planets = [
    { name: "Mercury", quiz: { question: "What is the smallest planet in our solar system?", options: ["Venus", "Earth", "Mercury", "Mars"], correctAnswer: "Mercury" } },
    // Add more planets with quiz questions
  ];
  randomPlanet = getRandomPlanet();

  // Initialize audio amplitude for visualization
  amplitude = new p5.Amplitude();
}

function draw() {
  background(220);
  displaySpaceship();
  displayPlanets();
  displayStats();
  handleHover();
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
}

function mousePressed() {
  // Check if the mouse is over the "Explore" button
  if (mouseX >= 20 && mouseX <= 120 && mouseY >= 250 && mouseY <= 290) {
    initiateQuiz();
    // Trigger pixel manipulation on quiz initiation
    pixelManipulated = true;
  }
}

function initiateQuiz() {
  // Quiz logic (unchanged)
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

function displaySpaceship() {
  // Display the spaceship (modify as needed)
  fill(255, 255, 0);
  rect(50, 200, 100, 80);
  triangle(50, 200, 25, 150, 75, 150);
  triangle(150, 200, 125, 150, 175, 150);
}

function displayPlanets() {
  // Display the list of available planets and the "Explore" button
  textSize(18);
  fill(0);
  text("Available Planets:", 20, 30);
  for (let i = 0; i < planets.length; i++) {
    text(i + 1 + ". " + planets[i].name, 20, 60 + i * 30);
  }
  fill(0, 255, 0);
  rect(20, 250, 100, 40);
  fill(0);
  textSize(16);
  text("Explore", 50, 275);
}

function displayStats() {
  // Display the player's score, days spent exploring, and current resources
  textSize(18);
  fill(0);
  text("Score: " + score, 20, 400);
  text("Days Spent Exploring: " + days, 20, 430);
  text("Current Resources: " + resources, 20, 460);
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
