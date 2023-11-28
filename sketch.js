// Define variables for your game
let spacecraft;
let planets = [];
let currentPlanet;
let gameStarted = false;
let points = 0;
let totalPlanets = 0;
let quizMode = false;
let quizAnswered = false;
let userAnswer = "";

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
const textDuration = 2000; // Time duration for each piece of text in milliseconds

function setup() {
  createCanvas(800, 600);
  // Initialize your game elements
  spacecraft = new Spacecraft();
  planets.push(new Planet(
    "Earth",
    color(0, 255, 0),
    100,
    200,
    "Home planet of humans.",
    generateMultipleChoiceQuestion("What is the third planet from the Sun?", ["Venus", "Earth", "Mars"], 1),
    "Earth"
  ));
  planets.push(new Planet(
    "Mars",
    color(255, 0, 0),
    500,
    400,
    "Known as the Red Planet.",
    generateMultipleChoiceQuestion("Which planet is known as the 'Red Planet'?", ["Earth", "Mars", "Jupiter"], 1),
    "Mars"
  ));
  planets.push(new Planet(
    "Jupiter",
    color(255, 255, 0),
    300,
    100,
    "Largest planet in our solar system.",
    generateMultipleChoiceQuestion("Which planet is the largest in our solar system?", ["Saturn", "Jupiter", "Neptune"], 2),
    "Jupiter"
  ));
  planets.push(new Planet(
    "Saturn",
    color(255, 165, 0),
    700,
    300,
    "Known for its stunning ring system.",
    generateMultipleChoiceQuestion("Which planet is known for its stunning ring system?", ["Saturn", "Uranus", "Mars"], 1),
    "Saturn"
  ));
  // Add more planets as needed
  totalPlanets = planets.length;
  currentPlanet = planets[0];
}

function draw() {
  background(0);

  if (gameStarted) {
    // Update and display game elements
    spacecraft.update();
    spacecraft.display();

    // Display current story text
    fill(255);
    textSize(18);
    textAlign(LEFT, TOP);
    text(storyTexts[currentStoryIndex], 20, 20);

    // Display points count while visiting planets
    text(`Points: ${points} out of ${totalPlanets}`, 20, 50);

    // Display planets
    for (let planet of planets) {
      planet.display();
    }

    // Check if the user has visited all planets
    if (points === totalPlanets && !quizMode) {
      quizMode = true;
      startQuiz();
    }

    // Check if the quiz question is displayed
    if (quizMode && !quizAnswered) {
      // Display quiz question
      fill(255);
      textSize(18);
      textAlign(LEFT, TOP);
      text(currentPlanet.quizQuestion, 20, height - 140);

      // Display answer choices
      let choices = currentPlanet.answerChoices;
      for (let i = 0; i < choices.length; i++) {
        text(`${i + 1}. ${choices[i]}`, 20, height - 100 + i * 30);
      }

      // Display user input
      text("Your Answer: " + userAnswer, 20, height - 50);
    }

    // Check if the text timer has elapsed, and move to the next piece of text
    if (millis() - textTimer > textDuration) {
      currentStoryIndex++;
      textTimer = millis();
    }
  } else {
    // Display game start message
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press Enter to Start", width / 2, height / 2);
  }
}

function keyPressed() {
  if (keyCode === ENTER && !gameStarted) {
    gameStarted = true;
    currentStoryIndex++;
    textTimer = millis(); // Start the text timer
  } else if (keyCode === ENTER && quizMode && !quizAnswered) {
    // Check the user's answer when Enter is pressed during the quiz
    checkAnswer();
  } else if (keyCode === BACKSPACE && quizMode && !quizAnswered) {
    // Allow the user to delete the last character in their answer
    userAnswer = userAnswer.slice(0, -1);
  }
}

function keyTyped() {
  if (quizMode && !quizAnswered) {
    // Append the typed character to the user's answer
    userAnswer += key;
  }
}

// Define your Spacecraft class
class Spacecraft {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed = 8; // Increased speed
  }

  update() {
    // Implement spacecraft movement logic
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

    // Check if spacecraft reaches a planet
    for (let planet of planets) {
      if (dist(this.x, this.y, planet.x, planet.y) < 100 && currentPlanet !== planet) {
        currentPlanet = planet;
        if (!planet.visited) {
          points++;
          planet.visited = true;
          displayFact(planet.fact);
        }
      }
    }
  }

  display() {
    // Implement spacecraft drawing logic
    fill(255);
    ellipse(this.x, this.y, 30, 30);
  }
}

// Define your Planet class
class Planet {
  constructor(name, col, x, y, fact, quizQuestion, correctAnswer) {
    this.name = name;
    this.color = col;
    this.x = x;
    this.y = y;
    this.fact = fact;
    this.quizQuestion = quizQuestion;
    this.correctAnswer = correctAnswer.toLowerCase(); // Convert to lowercase for case-insensitive comparison
    this.answerChoices = generateShuffledChoices([correctAnswer, ...generateIncorrectAnswers(2, name)]);
    this.visited = false;
  }

  display() {
    // Implement planet drawing logic
    fill(this.color);
    ellipse(this.x, this.y, 100, 100);

    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y);
  }
}

function displayFact(fact) {
  // Display the fact about the current planet
  storyTexts.push(`You earned a point! ${fact}`);
}

function startQuiz() {
  // Display quiz introduction
  storyTexts.push("Congratulations! You've visited all planets and earned points.");
  storyTexts.push("Now, it's time for a quiz. Use the number keys to select your answer.");
  storyTexts.push("Press Enter to submit your answer.");
  storyTexts.push(currentPlanet.quizQuestion);
}

function checkAnswer() {
  quizAnswered = true;
  let selectedChoice = parseInt(userAnswer) - 1; // Convert to zero-based index
  if (!isNaN(selectedChoice) && selectedChoice >= 0 && selectedChoice < currentPlanet.answerChoices.length) {
    if (currentPlanet.answerChoices[selectedChoice].toLowerCase() === currentPlanet.correctAnswer) {
      points++; // Correct answer earns a point
      storyTexts.push("Correct! You earned another point!");
    } else {
      storyTexts.push(`Incorrect. The correct answer is "${currentPlanet.correctAnswer}".`);
    }
    storyTexts.push(`You now have ${points} points.`);
  } else {
    storyTexts.push("Invalid choice. Please use the number keys to select your answer.");
  }
  userAnswer = ""; // Reset user's answer
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
  // Generate random incorrect answers for the quiz, using names of other planets
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
  // Return a random planet name
  const planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
  return planetNames[Math.floor(Math.random() * planetNames.length)];
}
