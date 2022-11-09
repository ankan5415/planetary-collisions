const canvasX = 1000,
  canvasY = 1000;
const planarOffset = 100;
const gravitationConstant = 6.67e-11;
const DISTANCE_CONVERSION = 10; // km per pixel
const FPS = 60;
class Sphere {
  constructor({ x, y, r, m, vX, vY, color, isFixed }) {
    this.isFixed = isFixed;
    this.color = color;
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(vX / FPS, vY / FPS);
    this.velocity.mult(3);
    this.radius = r;
    this.mass = m;
    this.minBound = new p5.Vector();
    this.maxBound = new p5.Vector();
    this.calculateBoundingBox();

    this.acceleration = new p5.Vector();
  }

  addSpheres(spheres) {
    //     Adds other spheres to compute acceleration with
    this.spheres = spheres;
  }

  calculateBoundingBox() {
    this.minBound.set(
      this.position.x - this.radius / 2,
      this.position.y - this.radius / 2
    );
    this.maxBound.set(
      this.position.x + this.radius / 2,
      this.position.y + this.radius / 2
    );
  }

  getDistance(sphere) {
    return this.position.dist(sphere.position);
  }

  getAcceleration(sphere) {
    const distance = this.getDistance(sphere);
    //     Compute angle between two spheres
    // const angle = this.position.angleBetween(sphere.position)
    const acc =
      (gravitationConstant * sphere.mass) /
      (distance * distance * DISTANCE_CONVERSION * DISTANCE_CONVERSION);
    return acc;
  }

  updateAcceleration() {
    // a = km/r^2
    //     Calculate angle between this sphere and all other spheres:
    this.spheres.forEach((sphere) => {
      const acc = this.getAcceleration(sphere);
      const angle = angleBetweenPos(this.position, sphere.position);
      const acc_x = acc * -cos(angle);
      const acc_y = acc * -sin(angle);
      this.acceleration.add(new p5.Vector(acc_x, acc_y));
    });
  }

  drawVelocity() {
    drawArrow(
      this.position,
      p5.Vector.add(
        this.position,
        p5.Vector.mult(this.velocity, new p5.Vector(5, 5))
      ),
      "black"
    );
  }

  update() {
    this.calculateBoundingBox();
    // this.checkCollision();
    if (!this.isFixed) {
      this.position.add(this.velocity);
      this.updateAcceleration();
      this.velocity.add(this.acceleration);
      this.acceleration.set(0, 0);
      this.drawVelocity();
    }
  }

  checkCollision() {
    //     If the ball dimensions are outside of the canvas range, then change the velocity
    if (this.minBound.x <= 0 || this.maxBound.x >= canvasX) {
      //     velocity change - if it hits a vertical wall, keep the Y velocity the same but reverse the X velocity
      this.velocity.set(-this.velocity.x, this.velocity.y);
    }
    //     If it hits a horizontal wall, keep the X velocity the same but reverse the Y velocity
    if (this.minBound.y <= 0 || this.maxBound.y >= canvasY) {
      this.velocity.set(this.velocity.x, -this.velocity.y);
    }
  }

  display() {
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius);
  }
}

const planet1 = new Sphere({
  x: canvasX / 2 + planarOffset,
  y: canvasY / 2 - 30,
  r: 20,
  m: 1e16,
  vX: 0,
  vY: 0,
  color: "yellow",
  isFixed: true,
});
const planet2 = new Sphere({
  x: canvasX / 2 - planarOffset,
  y: 30,
  r: 20,
  m: 1e15,
  vX: 0,
  vY: 100,
  color: "red",
});
// const planet3 = new Sphere(30, canvasY / 2, 20, 30, 0, 0, "blue");

planet1.addSpheres([planet2]);
planet2.addSpheres([planet1]);
// planet3.addSpheres([planet1, planet2]);
function setup() {
  angleMode(DEGREES);
  createCanvas(canvasX, canvasY);
}

function draw() {
  angleMode(DEGREES);
  background(230);
  planet1.update();
  planet1.display();
  planet2.update();
  planet2.display();
  fill("black");
  textSize(20);
  text(
    `Kinetic Energy: ${[planet1, planet2].map((planet) =>
      (p5.Vector.mag(planet.velocity) * p5.Vector.mag(planet.velocity)).toFixed(
        2
      )
    )}`,
    10,
    30
  );
  text(
    `Gravitational Energy: ${[
      (planet1.getDistance(planet2) * planet1.getAcceleration(planet2)).toFixed(
        2
      ),
      (planet2.getDistance(planet1) * planet2.getAcceleration(planet1)).toFixed(
        2
      ),
    ]}`,
    10,
    60
  );

  // drawArrow(planet1.position, planet2.position, "black")
}
