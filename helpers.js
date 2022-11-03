function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  line(base.x, base.y, vec.x, vec.y);
  pop();
}

function angleBetweenPos(pos1, pos2) {
  const res = p5.Vector.sub(pos1, pos2);
  return atan2(res.y, res.x);
}
