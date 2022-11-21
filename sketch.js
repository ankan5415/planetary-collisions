function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true); // noRedraw
}

// Variables: approach distance between planets, approach velocity, mass

X_DISTANCE_BETWEEN = 1400;
Y_DISTANCE_BETWEEN = 200;
APPROACH_VELOCITY = 5;
MASS = 1000;
const GRAVITATION_CONSTANT = 70;
const TRAIL_LENGTH = 1500;

let planets = [];

class Planet {
  constructor({ mass, position, velocity, id }) {
    this.id = id;
    this.m = mass;
    this.x = position.x;
    this.y = position.y;
    this.p = position;
    this.v = velocity;
    this.trail = [];
    this.colour = computeColor();
  }

  move() {
    this.x += this.v.x;
    this.y += this.v.y;
  }

  collide(planet) {
    this.collided = true;
    // mv2 = mv2
    const thisM = createVector(this.v.x * this.mass, this.v.y * this.mass);
    const otherM = createVector(
      planet.v.x * planet.mass,
      planet.v.y * planet.mass
    );
    this.mass += planet.mass;
    const sumM = p5.Vector.add(thisM, otherM);
    this.v = createVector(sumM.x / this.mass, sumM.y / this.mass);
    planets = [];
  }

  escape() {
    this.escaped = true;
    planets = [];
  }

  calculateForceWithPlanet(planet) {
    const distance = Math.sqrt(
      Math.pow(this.x - planet.x, 2) + Math.pow(this.y - planet.y, 2)
    );
    console.log(distance);

    if (distance < 20 || this.v.mag() > APPROACH_VELOCITY * 10) {
      this.collide(planet);
      return createVector(0, 0);
    }
    // const distance = p5.Vector.dist(planet.p, this.p);
    // Determine force
    const force =
      (GRAVITATION_CONSTANT * planet.m * this.m) / (distance * distance);
    // Determine x and y components of force
    // const sub = p5.Vector.sub(planet.p, this.p);
    const angle = Math.atan(
      Math.abs(this.y - planet.y) / Math.abs(this.x - planet.x)
    );
    // const angle = atan2(sub.y, sub.x);
    let fx = cos(angle) * force;
    let fy = sin(angle) * force;
    if (planet.x < this.x) fx = fx * -1;
    if (planet.y < this.y) fy = fy * -1;
    this.fx = fx;
    this.fy = fy;
    return createVector(fx, fy);
  }

  calculateAcceleration(force) {
    const ax = force.x / this.m;
    const ay = force.y / this.m;
    return createVector(ax, ay);
  }

  accelerate(acceleration) {
    this.v.x = this.v.x + acceleration.x;
    this.v.y = this.v.y + acceleration.y;
  }

  update() {
    planets.forEach((planet) => {
      if (planet.id == this.id) return;
      let force = this.calculateForceWithPlanet(planet);
      let acceleration = this.calculateAcceleration(force);
      this.accelerate(acceleration);
    });
    this.move();
    this.trail.push(createVector(this.x, this.y));
    if (this.trail.length > TRAIL_LENGTH) this.trail.splice(0, 1);
  }

  show() {
    noFill();
    beginShape();
    stroke(this.colour);
    for (let i = 0; i < this.trail.length; i++) {
      var pos = this.trail[i];
      vertex(pos.x, pos.y);
    }
    endShape();
    fill(this.colour);
    circle(this.x, this.y, log(this.m) * 10);
  }
}

// Data generator:
// create initial planets
// During update sequence if they collide then destroy planets, create new ones with different test values and get it going again.

const I_MASS = 10;
const I_VELOCITY = 10;
const I_DIST = 100;

let c_y_dist = 100;
let c_x_dist = 100;
let c_velocity = 0;
let c_mass = 10;

const MAX_Y_DIST = 1400; //slightly less than window windowWidth
const MAX_X_DIST = 800;
const DIST_INC = 10;
const MAX_VELOCITY = 30;
const VELOCITY_INC = 0.1;
const MAX_MASS = 3000;
const MASS_INC = 10;

function setup() {
  frameRate(120);
  planets = [
    new Planet({
      mass: MASS,
      position: createVector(
        windowWidth / 2 - X_DISTANCE_BETWEEN / 2,
        windowHeight / 2 - Y_DISTANCE_BETWEEN / 2
      ),
      velocity: createVector(APPROACH_VELOCITY, 0),
      id: 0,
    }),
    new Planet({
      mass: MASS,
      position: createVector(
        windowWidth / 2 + X_DISTANCE_BETWEEN / 2,
        windowHeight / 2 + Y_DISTANCE_BETWEEN / 2
      ),
      velocity: createVector(-APPROACH_VELOCITY, 0),
      id: 1,
    }),
  ];

  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20, 20, 20);
  planets.forEach((planet) => {
    planet.update();
    planet.show();
  });
  if (planets.length == 0) {
    c_mass += MASS_INC;
    if (c_mass <= MAX_MASS) return;
    c_mass = I_MASS;
    c_velocity += VELOCITY_INC;
    if (c_velocity <= MAX_VELOCITY) return;
    c_velocity = I_VELOCITY;
    c_x_dist += DIST_INC;
    if (c_x_dist <= MAX_X_DIST) return;
    c_x_dist = I_DIST;
    c_y_dist += DIST_INC;
    if (c_y_dist <= MAX_Y_DIST) return;
  }
}
