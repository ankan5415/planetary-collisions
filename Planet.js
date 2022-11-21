const GRAVITATION_CONSTANT = 70;
const TRAIL_LENGTH = 1500;
class Planet {
  constructor({ mass, position, velocity }) {
    this.m = mass;
    this.x = position.x;
    this.y = position.y;
    this.p = position;
    this.v = velocity;
    this.trail = [];
    this.colour = computeColor();
    this.planets = [];
  }

  addPlanet(planet) {
    this.planets.push(planet);
  }

  move() {
    this.x += this.v.x;
    this.y += this.v.y;
  }

  collide(other_object) {
    this.collided = true;
    // mv2 = mv2
    const thisM = createVector(this.v.x * this.mass, this.v.y * this.mass);
    const otherM = createVector(
      other_object.v.x * other_object.mass,
      other_object.v.y * other_object.mass
    );
    this.mass += other_object.mass;
    const sumM = p5.Vector.add(thisM, otherM);
    this.velocity = createVector(sumM.x / this.mass, sumM.y / this.mass);
  }

  calculate_force_with(other_object) {
    //use gravity equation to find x and y force components with other object
    var distance = Math.sqrt(
      Math.pow(this.x - other_object.x, 2) +
        Math.pow(this.y - other_object.y, 2)
    );
    if (distance < 30) {
      this.collide(other_object);
      return createVector(0, 0);
    }
    //Law of universal gravitation
    var force =
      gravitational_constant *
      ((this.mass * other_object.mass) / Math.pow(distance, 2));
    var direction = Math.atan(
      Math.abs(this.y - other_object.y) / Math.abs(this.x - other_object.x)
    );
    var fx = force * Math.abs(Math.cos(direction));
    var fy = force * Math.abs(Math.sin(direction));
    if (other_object.x < this.x) {
      fx = fx * -1;
    }
    if (other_object.y < this.y) {
      fy = fy * -1;
    }
    this.fx = fx;
    this.fy = fy;
    return createVector(fx, fy);
  }

  calculateForceWithPlanet(planet) {
    const distance = Math.sqrt(
      Math.pow(this.x - planet.x, 2) + Math.pow(this.y - planet.y, 2)
    );
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
    this.planets.forEach((planet) => {
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
    circle(this.x, this.y, this.m / 2);
  }
}
