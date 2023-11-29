// Define global variables
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

let startQuizButton; // ADDED: New button for starting the quiz
let congratulationsScreen = false;
let failureScreen = false;

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

  // ADDED: Create the "Start Quiz" button
  startQuizButton = createButton('Start Quiz');
  startQuizButton.position(width - 100, height - 50);
  startQuizButton.mousePressed(startQuiz);
}

function draw() {
  background(0);

  if (gameStarted && !quizStarted) { // Check if the game is started but quiz hasn't started
    // Update and display game elements
    spacecraft.update();
    spacecraft.display();

    // Display current story text
    fill(255);
    textSize(18);
    textAlign(CENTER, TOP);
    text(storyTexts[currentStoryIndex], width/2, 20);

    // Display points count while visiting planets
    text(`Points: ${points} out of ${totalPlanets}`, 400, 40);

    // Display planets
    for (let planet of planets) {
      planet.display();
    }

    // Check if the user has visited all planets
    if (points === totalPlanets && !quizMode) {
      startQuizButton.show();
    }

    // Check if the text timer has elapsed, and move to the next piece of text
    if (millis() - textTimer > textDuration) {
      currentStoryIndex++;
      textTimer = millis();
      storyTextFinished = true;
    }
  } else if (quizStarted) { // Check if the quiz         
    fill(255);
    textSize(18);
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
  } else if (failureScreen) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("I'm sorry! You failed the quiz!", width / 2, height / 2); 
  } else { // Display game start message
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press Enter to Start", width / 2, height / 2);
  }
}


function keyPressed() {
  if (keyCode === ENTER && !gameStarted) {
    gameStarted = true;
    spacecraft.setGameStarted(true); // Set gameStarted to true for the spacecraft
    currentStoryIndex++;
    textTimer = millis(); // Start the text timer
    storyTextFinished = false;
  } else if (keyCode === ENTER && quizMode && !quizAnswered) {
    // Check the user's answer when Enter is pressed during the quiz
    checkAnswer();
  } else if (keyCode === BACKSPACE && quizMode && !quizAnswered) {
    // Allow the user to delete the last character in their answer
    userAnswer = userAnswer.slice(0, -1);
  } else if (quizMode && !quizAnswered && storyTextFinished) {
    // Capture typed characters for the user's answer during the quiz
    userAnswer += key;
  }
}

function keyTyped() {
  //if(!storyTextFinished){
    //return
  if (quizMode && !quizAnswered && storyTextFinished) {
    // Append the typed character to the user's answer
    //userAnswer += key;
  }

  if (quizMode && !quizAnswered) {
    // Capture typed characters for the user's answer during the quiz
    userAnswer += key;
  }
}

// Define your Spacecraft class
class Spacecraft {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed = 8; // Increased speed
    this.gameStarted = false; // New property to track game state
  }

  update() {
    // Check if the game has started before allowing the spacecraft to move
    if (this.gameStarted) {
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
  }

  display() {
    // Implement spacecraft drawing logic
    fill(255);
    ellipse(this.x, this.y, 30, 30);
  }

  // Add a new method to set the gameStarted property
  setGameStarted(value) {
    this.gameStarted = value;
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
  
  // Check if all planets are visited
  if (points === totalPlanets) {
    startQuizButton.show();
  } else {
    // Move to the next planet
    nextPlanet();
  }
}
function nextPlanet() {
  // Find the next unvisited planet
  currentPlanet = planets.find(planet => !planet.visited);

  // If there are no unvisited planets, start the quiz
  if (!currentPlanet) {
    startQuizButton.show();
  }
}

function startQuiz() {
  // Hide all elements except the quiz
  quizStarted = true;
  gameStarted = false;
  startQuizButton.hide();
  storyTexts = [];

  // Shuffle the order of planets for random questions
  planets = shuffle(planets);

  // Display quiz introduction
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
    // All questions asked
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
    // All questions asked
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

