function computeColor() {
  let red = random(255);
  let green = random(255);
  let blue = random(255);

  let brightness = Math.sqrt(
    0.241 * Math.pow(red, 2) +
      0.691 * Math.pow(green, 2) +
      0.068 * Math.pow(blue, 2)
  );

  while (brightness < 100) {
    red = random(255);
    green = random(255);
    blue = random(255);
    brightness = Math.sqrt(
      0.241 * Math.pow(red, 2) +
        0.691 * Math.pow(green, 2) +
        0.068 * Math.pow(blue, 2)
    );
  }
  return color(red, green, blue);
}
