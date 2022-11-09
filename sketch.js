function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true); // noRedraw
}

X_DISTANCE_BETWEEN = 400;
Y_DISTANCE_BETWEEN = 200;
APPROACH_VELOCITY = 2.1;
let planets = [];

function setup() {
  planets = [
    new Planet({
      mass: 30,
      position: createVector(
        windowWidth / 2 - X_DISTANCE_BETWEEN / 2,
        windowHeight / 2 - Y_DISTANCE_BETWEEN / 2
      ),
      velocity: createVector(APPROACH_VELOCITY, 0),
    }),
    new Planet({
      mass: 30,
      position: createVector(
        windowWidth / 2 + X_DISTANCE_BETWEEN / 2,
        windowHeight / 2 + Y_DISTANCE_BETWEEN / 2
      ),
      velocity: createVector(-APPROACH_VELOCITY, 0),
    }),
  ];

  // Add planets
  for (let i = 0; i < planets.length; i++) {
    for (let j = 0; j < planets.length; j++) {
      if (i != j) planets[i].addPlanet(planets[j]);
    }
  }

  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20, 20, 20);
  planets.forEach((planet) => {
    planet.update();
    planet.show();
  });
}
