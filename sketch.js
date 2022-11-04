const canvasX = 500,
  canvasY = 500;
const planarOffset = 50;
const gravitationConstant = 5;
class Sphere {
  constructor(x, y, r, m, vX, vY, color) {
    this.color = color;
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(vX, vY);
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

  computeAcceleration() {
    // a = km/r^2
    //     Calculate angle between this sphere and all other spheres:
    this.spheres.forEach((sphere) => {
      //     Compute distance between two spheres
      const distance = this.position.dist(sphere.position);
      //     Compute angle between two spheres
      // const angle = this.position.angleBetween(sphere.position)
      const angle = angleBetweenPos(this.position, sphere.position);
      //     Get x and y vectors of acceleration using sine and cosine with angle
      const acc_x =
        (gravitationConstant * -cos(angle) * sphere.mass) /
        (distance * distance);
      const acc_y =
        (gravitationConstant * -sin(angle) * sphere.mass) /
        (distance * distance);
      this.acceleration.add(new p5.Vector(acc_x, acc_y));
      // const viewAccX = new p5.Vector(-cos(angle) * 25, 0);
      // const viewAccY = new p5.Vector(0, -sin(angle) * 25);
      // drawArrow(this.position, p5.Vector.add(this.position, viewAccX), "red");
      // drawArrow(this.position, p5.Vector.add(this.position, viewAccY), "red");
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
    this.checkCollision();
    this.position.add(this.velocity);
    this.computeAcceleration();
    this.velocity.add(this.acceleration);
    this.acceleration.set(0, 0);
    this.drawVelocity();
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

const planet1 = new Sphere(
  canvasX / 2 + planarOffset,
  canvasY - 30,
  20,
  30,
  0,
  0,
  "yellow"
);
const planet2 = new Sphere(canvasX / 2 - planarOffset, 30, 20, 30, 0, 0, "red");
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
  // planet3.update();
  // planet3.display();
  fill("black");
  textSize(20);
  text(
    `Planet 1: ${planet1.position.x.toFixed(1)}, ${planet1.position.y.toFixed(
      1
    )}`,
    0,
    canvasY - 50
  );
  text(
    `Planet 2: ${planet2.position.x.toFixed(1)}, ${planet2.position.y.toFixed(
      1
    )}`,
    0,
    canvasY - 30
  );
  // text(`Angle between: ${degrees(planet2.position.angleBetween(planet1.position)).toFixed(3)}`, 0, canvasY-10)
  // drawArrow(planet1.position, planet2.position, "black")
  text(
    `Angle between: ${angleBetweenPos(planet1.position, planet2.position)}`,
    0,
    canvasY - 10
  );
  // drawArrow(planet1.position, planet2.position, "black")
}
