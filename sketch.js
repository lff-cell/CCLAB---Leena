// sketch.js
let planets;
let randomPlanet;
let score = 0;
let days = 1;
let resources = 50;
let explorationSpeed = 5;

function setup() {
  createCanvas(800, 600);
  planets = [
    // ... (same as before)
  ];

  randomPlanet = getRandomPlanet();
}

function draw() {
  background(220);
  displaySpaceship();
  displayPlanets();
  displayStats();
  handleHover();

  // Simulate exploration speed based on the slider value
  frameRate(explorationSpeed);
}

function mousePressed() {
  if (mouseX >= 20 && mouseX <= 120 && mouseY >= 250 && mouseY <= 290) {
    initiateQuiz();
  }
}

function initiateQuiz() {
  let quiz = randomPlanet.quiz;
  let answer = prompt(quiz.question + "\n" + quiz.options.join(", "));

  if (answer === quiz.correctAnswer) {
    console.log("Correct! You earned 10 points.");
    score += 10;
    resources += 20;
  } else {
    console.log("Incorrect! You lost 10 points.");
    score -= 10;
    resources -= 10;
  }

  if (resources <= 0) {
    console.log("You've run out of resources. Game over!");
    noLoop();
  } else {
    days++;
    randomPlanet = getRandomPlanet();
  }
}

function getRandomPlanet() {
  return random(planets);
}

function displaySpaceship() {
  fill(255, 255, 0);
  rect(50, 200, 100, 80);
  triangle(50, 200, 25, 150, 75, 150);
  triangle(150, 200, 125, 150, 175, 150);
}

function displayPlanets() {
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
  textSize(18);
  fill(0);
  text("Score: " + score, 20, 400);
  text("Days Spent Exploring: " + days, 20, 430);
  text("Current Resources: " + resources, 20, 460);
}

function handleHover() {
  if (
    mouseX >= 20 &&
    mouseX <= 120 &&
    mouseY >= 250 &&
    mouseY <= 290
  ) {
    document.getElementById("controls").style.backgroundColor = "#8cf58c";
  } else {
    document.getElementById("controls").style.backgroundColor = "#f0f0f0";
  }
}

document.getElementById("speed-slider").addEventListener("input", function () {
  explorationSpeed = this.value;
  document.getElementById("speed-value").innerText = "Speed: " + explorationSpeed;
});
