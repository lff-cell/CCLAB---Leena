let spacecraft;
let planets = [];
let currentPlanet;
let gameStarted = false;
let points = 0;
let totalPlanets = 0;
let quizMode = false;
let quizAnswered = false;
let userAnswer = "";
let quizStarted = false;
let quizScore = 0;
let storyTextFinished = false;
let stars = [];
const numStars = 200;
let videoCapture;
let currentBackgroundColor = 0;

let storyTexts = [
  "Welcome to the Space Exploration Game!",
  "You are on a mission to explore distant planets.",
  "Your spacecraft is equipped with advanced technology.",
  "Use the arrow keys to navigate through space.",
  "Visit planets to earn points and learn interesting facts.",
  // Add more story texts as needed
];

let currentStoryIndex = 0;
let textTimer = 0;
const textDuration = 5000; // Time duration for each piece of text in milliseconds

let startQuizButton;
let congratulationsScreen = false;
let failureScreen = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  fullscreen();

  // Create video capture
  videoCapture = createCapture(VIDEO);
  videoCapture.size(80, 40); // Set the size of the video feed
  videoCapture.hide(); // Hide the default video feed

  // Initialize your game elements
  spacecraft = new Spacecraft();
  planets.push(new Planet(
    "Earth",
    color(102, 204, 255),
    width / 2 + 200 * cos(PI/3),
    height / 2 + 200 * sin(PI/3),
    "Earth: Has you in it and is the third planet from the sun.",
    generateMultipleChoiceQuestion("What has you in it and is the third planet from the Sun?", ["Venus", "Earth", "Mars"], 1),
    "Earth"
  ));
  planets.push(new Planet(
    "Mars",
    color(255, 102, 102),
    width / 2 + 200 * cos(2 * PI/3),
    height / 2 + 200 * sin(2 * PI/3),
    "Mars: Olympus Mons, the largest volcano in our solar system, is found on Mars.",
    generateMultipleChoiceQuestion("Which planet has the largest volcano in our solar system?", ["Earth", "Mars", "Jupiter"], 1),
    "Mars"
  ));
  planets.push(new Planet(
    "Jupiter",
    color(255, 178, 102),
    width / 2 + 200 * cos(PI),
    height / 2 + 200 * sin(PI),
    "Jupiter: Has a strong magnetic field and dozens of moons, including the four largest known as the Galilean moons.",
    generateMultipleChoiceQuestion("Which planet has the Galilean moons?", ["Saturn", "Jupiter", "Neptune"], 2),
    "Jupiter"
  ));
  planets.push(new Planet(
    "Saturn",
    color(232, 214, 173),
    width / 2 + 200 * cos(-2 * PI/3),
    height / 2 + 200 * sin(-2 * PI/3),
    "Saturn: It has a low density, and if you could find a bathtub big enough, would float in water.",
    generateMultipleChoiceQuestion("Which planet could float in water if given the opportunityy?", ["Saturn", "Uranus", "Mars"], 1),
    "Saturn"
  ));
  planets.push(new Planet(
    "Uranus",
    color(173, 216, 230),
    width / 2 + 200 * cos(-PI/3),
    height / 2 + 200 * sin(-PI/3),
    "Uranus:  Known as an 'ice giant' because of its composition, which includes water, ammonia, and methane.",
    generateMultipleChoiceQuestion("Which planet is known as an ice giant?", ["Venus", "Mars", "Uranus"], 3),
    "Uranus"
  ));
  planets.push(new Planet(
    "Mercury",
    color(169, 169, 169),
    width / 2 + 200 * cos(PI/6),
    height / 2 + 200 * sin(PI/6),
    "Mercury: named after the Roman messenger god Mercury, who was known for his speed and eloquence.",
    generateMultipleChoiceQuestion("Which planet is named after a Roman messenger god which reflects the planet's swift movement across the sky?", ["Venus", "Mercury", "Mars"], 2),
    "Mercury"
  ));
  planets.push(new Planet(
    "Venus",
    color(255, 204, 102),
    width / 2 + 200 * cos(5 * PI/6),
    height / 2 + 200 * sin(5 * PI/6),
    "Venus: Second planet from the sun and it is also the name of a Roman goddess.",
    generateMultipleChoiceQuestion("Which planet has the same name of a Roman goddess?", ["Venus", "Earth", "Mars"], 1),
    "Venus"
  ));
  planets.push(new Planet(
    "Neptune",
    color(68, 102, 255),
    width / 2 + 200 * cos(-5 * PI/6),
    height / 2 + 200 * sin(-5 * PI/6),
    "Neptune: Has geysers that spew nitrogen gas into space.",
    generateMultipleChoiceQuestion("Which planet has geysers that spew nitrogen gas into space?", ["Jupiter", "Saturn", "Neptune"], 3),
    "Neptune"
  ));

  totalPlanets = planets.length;
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(1, 3),
    });
  }

  // Create the "Start Quiz" button
  startQuizButton = createButton('Start Quiz');
  startQuizButton.position(width - 100, height - 50);
  startQuizButton.mousePressed(startQuiz);
}

function draw() {
  background(0);
  background(currentBackgroundColor);


  if (gameStarted && !quizStarted) {
    // Update and display game elements
    spacecraft.update();
    spacecraft.display();

    // Display current story text
    fill(255);
    textSize(18);
    textAlign(CENTER, BOTTOM);
    text(storyTexts[currentStoryIndex], width / 2, 20);

    // Display points count while visiting planets
    text(`Points: ${points} out of ${totalPlanets}`, 70, 40);

    // Display planets
    for (let planet of planets) {
      planet.display();
    }
    drawStars();

    if (points === totalPlanets && !quizMode) {
      startQuizButton.show();
    }

    if (millis() - textTimer > textDuration) {
      currentStoryIndex++;
      textTimer = millis();
      storyTextFinished = true;
    }
  } else if (quizStarted) {
    fill(255);
    textSize(18);
    drawStars();

    textAlign(CENTER, TOP);
    text(currentPlanet.quizQuestion, width / 2, height / 4);

    let choices = currentPlanet.answerChoices;
    for (let i = 0; i < choices.length; i++) {
      let button = createButton(`${i + 1}. ${choices[i]}`);
      button.position(width / 2 - 50, height / 2 + i * 40);
      button.mousePressed(() => {
        if (!quizAnswered) {
          checkAnswer(i);
        }
      });
    }

    text(`Your Answer: ${userAnswer}`, width / 2, height / 1.2);
    text(`Quiz Score: ${quizScore} out of ${totalPlanets}`, width / 2, height / 1.1);
  } else if (congratulationsScreen) {
    fill(255);
    textSize(32);

    textAlign(CENTER, CENTER);
    text("Congratulations! You passed the quiz!", width / 2, height / 2);
    drawStars();
  } else if (failureScreen) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("I'm sorry! You failed the quiz!", width / 2, height / 2);
  } else {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press Enter to Start", width / 2, height / 2);
    drawStars();
  }
}

function drawStars() {
  fill(255);

  for (let i = 0; i < numStars; i++) {
    ellipse(stars[i].x, stars[i].y, stars[i].size, stars[i].size);

    stars[i].x += stars[i].speed;

    if (stars[i].x > width) {
      stars[i].x = 0;
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER && !gameStarted) {
    gameStarted = true;
    spacecraft.setGameStarted(true);
    currentStoryIndex++;
    textTimer = millis();
    storyTextFinished = false;
  } else if (keyCode === ENTER && quizMode && !quizAnswered) {
    checkAnswer();
  } else if (keyCode === BACKSPACE && quizMode && !quizAnswered) {
    userAnswer = userAnswer.slice(0, -1);
  } else if (quizMode && !quizAnswered && storyTextFinished) {
    userAnswer += key;
  }
}

function keyTyped() {
  if (quizMode && !quizAnswered && storyTextFinished) {
    userAnswer += key;
  }

  if (quizMode && !quizAnswered) {
    userAnswer += key;
  }
}

class Spacecraft {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed = 8;
    this.gameStarted = false;
    this.color = color(255, 255, 0);
  }

  update() {
    if (this.gameStarted) {
      if (keyIsDown(LEFT_ARROW)) {
        this.x -= this.speed;
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.x += this.speed;
      }
      if (keyIsDown(UP_ARROW)) {
        this.y -= this.speed;
      }
      if (keyIsDown(DOWN_ARROW)) {
        this.y += this.speed;
      }
      for (let planet of planets) {
        if (
          dist(this.x, this.y, planet.x, planet.y) < 100 &&
          currentPlanet !== planet &&
          mouseIsPressed
        ) {
          currentPlanet = planet;
          if (!planet.visited) {
            points++;
            planet.visited = true;
            displayFact(planet.fact);

            // Trigger effect for Earth
            if (planet.name === "Earth") {
              displayFact(planet.fact);
              currentBackgroundColor = color(20, 20, 60);
              setTimeout(() => (currentBackgroundColor = color(0)), 5000); // Lasts for 5 seconds
            } else if (planet.name === "Mars") {
              displayFact(planet.fact);
              shakeCanvas(100); // Increase the shake intensity
              setTimeout(() => displayFact(""), 5000); // Lasts for 5 seconds
            } else if (planet.name === "Jupiter") {
              displayFact(planet.fact);
              generateSatellites(150); // Increase the number of satellites
              setTimeout(() => generateSatellites(0), 12000); // Lasts for 8 seconds
            } else if (planet.name === "Saturn") {
              displayFact(planet.fact);
              createRing(planet.x, planet.y);
              setTimeout(() => createRing(0, 0), 8000); // Lasts for 8 seconds
            } else if (planet.name === "Uranus") {
              displayFact(planet.fact);
              generateAuroras(200); // Increase the number of auroras
              setTimeout(() => generateAuroras(0), 8000); // Lasts for 8 seconds
            } else if (planet.name === "Mercury") {
              displayFact(planet.fact);
              createCraters(100); // Increase the number of craters
              setTimeout(() => createCraters(0), 8000); // Lasts for 5 seconds
            } else if (planet.name === "Venus") {
              displayFact(planet.fact);
              generateVolcanoes(150); // Increase the number of volcanoes
              setTimeout(() => generateVolcanoes(0), 12000); // Lasts for 8 seconds
            } else if (planet.name === "Neptune") {
              displayFact(planet.fact);
              createNeptuneVortex(planet.x, planet.y);
              setTimeout(() => createStorm(5, 100), 8000); // Lasts for 8 seconds
            }


            for (let i = 0; i < 5; i++) {
              planet.spawnAsteroid();
            }
          }
        }
      }
    }
  }


  display() {
    image(videoCapture, this.x - 30, this.y - 20, 60, 40);


    fill(255, 0, 0);
    triangle(this.x - 20, this.y + 20, this.x - 40, this.y + 30, this.x - 30, this.y);
    triangle(this.x + 20, this.y + 20, this.x + 40, this.y + 30, this.x + 30, this.y);
  }

  setGameStarted(value) {
    this.gameStarted = value;
  }
}

class Planet {
  constructor(name, col, x, y, fact, quizQuestion, correctAnswer) {
    this.name = name;
    this.color = col;
    this.x = x;
    this.y = y;
    this.fact = fact;
    this.quizQuestion = quizQuestion;
    this.correctAnswer = correctAnswer.toLowerCase();
    this.answerChoices = generateShuffledChoices([correctAnswer, ...generateIncorrectAnswers(2, name)]);
    this.visited = false;
    this.asteroids = []; // New property to store falling asteroids
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, 100, 100);

    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y);

    // Display falling asteroids when the planet is visited
    if (this.visited) {
      for (let asteroid of this.asteroids) {
        asteroid.display();
        asteroid.fall();
      }
    }
  }

  spawnAsteroid() {
    // Add a new asteroid to the asteroids array
    this.asteroids.push(new Asteroid(this.x, this.y));
  }
}


class Asteroid {
  constructor(x, y) {
    this.x = x + random(-50, 50); // Initialize position near the planet
    this.y = y;
    this.size = random(5, 20);
    this.speed = random(2, 5);
  }

  display() {
    fill(150); // Customize the color of the asteroids
    ellipse(this.x, this.y, this.size, this.size);
  }

  fall() {
    // Move the asteroid downward
    this.y += this.speed;

    // Reset the position if it goes below the canvas
    if (this.y > height) {
      this.y = 0;
    }
  }
}


function displayFact(fact) {
  storyTexts.push(`You earned a point! ${fact}`);
  
  if (points === totalPlanets) {
    startQuizButton.show();
  } else {
    nextPlanet();
  }
}

function nextPlanet() {
  currentPlanet = planets.find(planet => !planet.visited);

  if (!currentPlanet) {
    startQuizButton.show();
  }
}

function startQuiz() {
  quizStarted = true;
  gameStarted = false;
  startQuizButton.hide();
  storyTexts = [];
  planets = shuffle(planets);

  storyTexts.push("Congratulations! You've visited all planets and earned points.");
  storyTexts.push("Now, it's time for a quiz. Use the number keys to select your answer.");
  storyTexts.push("Press Enter to submit your answer.");
  nextQuestion();
}

function checkAnswer(selectedChoice) {
  quizAnswered = true;
  if (selectedChoice >= 0 && selectedChoice < currentPlanet.answerChoices.length) {
    if (currentPlanet.answerChoices[selectedChoice].toLowerCase() === currentPlanet.correctAnswer) {
      quizScore++;
      storyTexts.push("Correct! You earned another point!");
    } else {
      storyTexts.push(`Incorrect. The correct answer is "${currentPlanet.correctAnswer}".`);
    }
    storyTexts.push(`Your current score: ${quizScore} out of ${totalPlanets}`);
  } else {
    storyTexts.push("Invalid choice. Please use the number keys to select your answer.");
  }
  removeButtons();

  if (planets.length > 0) {
    nextQuestion();
  } else {
    quizStarted = false;
    if (quizScore / totalPlanets > 0.7) {
      congratulationsScreen = true;
    }
    if (quizScore / totalPlanets < 0.7) {
      failureScreen = true;
    }
  }
}

function removeButtons() {
  let buttons = selectAll('button');
  for (let button of buttons) {
    button.remove();
  }
}

function nextQuestion() {
  if (planets.length > 0) {
    currentPlanet = planets.pop();
    quizAnswered = false;
    userAnswer = "";
  } else {
    quizStarted = false;
    if (points / totalPlanets > 0.7) {
      congratulationsScreen = true;
    }
  }
}

function shuffle(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateMultipleChoiceQuestion(question, choices, correctIndex) {
  let shuffledChoices = generateShuffledChoices(choices);
  let correctAnswer = shuffledChoices[correctIndex - 1];
  return `${question} (${shuffledChoices.join(", ")})`;
}

function generateShuffledChoices(choices) {
  let shuffled = choices.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateIncorrectAnswers(count, currentPlanetName) {
  let incorrectAnswers = [];
  for (let i = 0; i < count; i++) {
    let randomPlanetName;
    do {
      randomPlanetName = getRandomPlanetName();
    } while (randomPlanetName === currentPlanetName);

    incorrectAnswers.push(randomPlanetName);
  }
  return incorrectAnswers;
}

function getRandomPlanetName() {
  const planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
  return planetNames[Math.floor(Math.random() * planetNames.length)];
}
function shakeCanvas(intensity) {
  translate(random(-intensity, intensity), random(-intensity, intensity));
}
function createRing(centerX, centerY) {
  // Function to create a ring around the specified center coordinates
  strokeWeight(2);
  stroke(255, 255, 0);
  noFill();
  ellipse(centerX, centerY, 120, 120);
}

function generateSatellites(numSatellites) {
  // Function to generate satellites around the spacecraft
  for (let i = 0; i < numSatellites; i++) {
    let angle = random(TWO_PI);
    let distance = random(50, 150);
    let satelliteX = spacecraft.x + distance * cos(angle);
    let satelliteY = spacecraft.y + distance * sin(angle);

    fill(255, 255, 0);
    ellipse(satelliteX, satelliteY, 10, 10);
  }
}

function generateAuroras(numAuroras) {
  // Function to generate auroras around the spacecraft
  for (let i = 0; i < numAuroras; i++) {
    let auroraX = random(width);
    let auroraY = random(height);

    stroke(0, 255, 0, 150);
    strokeWeight(2);
    line(auroraX, auroraY, auroraX + random(-20, 20), auroraY + random(-20, 20));
  }
}

function createCraters(numCraters) {
  // Function to create craters on the planet
  for (let i = 0; i < numCraters; i++) {
    let craterX = random(width);
    let craterY = random(height);

    fill(150);
    ellipse(craterX, craterY, 20, 20);
  }
}

function generateVolcanoes(numVolcanoes) {
  // Function to generate volcanoes on the planet
  for (let i = 0; i < numVolcanoes; i++) {
    let volcanoX = random(width);
    let volcanoY = random(height);

    fill(255, 0, 0);
    triangle(volcanoX - 10, volcanoY + 20, volcanoX + 10, volcanoY + 20, volcanoX, volcanoY);
  }
}
function createNeptuneVortex(centerX, centerY) {
  // Function to create a swirling vortex around the specified center coordinates
  let numLines = 20;
  let radius = 30;

  for (let i = 0; i < numLines; i++) {
    let angle = map(i, 0, numLines, 0, TWO_PI);
    let startX = centerX + radius * cos(angle);
    let startY = centerY + radius * sin(angle);
    let endX = centerX + (radius + 30) * cos(angle);
    let endY = centerY + (radius + 30) * sin(angle);

    stroke(0, 0, 255);
    strokeWeight(2);
    line(startX, startY, endX, endY);
  }
}
