const rodCounts = [1, 3, 4, 4, 3, 1];
const rodTeams = ["p1", "p2", "p1", "p2", "p1", "p2"];

const FIELD_W = 920;
const FIELD_H = 516;

function setup() {
  createCanvas(1000, 600, WEBGL);
}

function draw() {
  background(30);

  // camera fixed
  camera(0, -720, 620, 0, 0, 0, 0, 0, -1);

  ambientLight(90);
  directionalLight(255, 255, 255, -0.5, 0.8, -1);

  drawTable();
  drawFieldLines();
  drawAllRods();
}

function drawTable() {
  // field
  push();
  translate(0, 0, 0);
  noStroke();
  fill(1, 90, 45);
  box(FIELD_W, FIELD_H, 18);
  pop();

  // outer walls
  const wallT = 35;
  const wallH = 90;

  ambientMaterial(150, 100, 60);
  noStroke();

  // front wall
  push();
  translate(0, -FIELD_H / 2 - wallT / 2, wallH / 2);
  box(FIELD_W + wallT * 2, wallT, wallH);
  pop();

  //  back wall
  push();
  translate(0, FIELD_H / 2 + wallT / 2, wallH / 2);
  box(FIELD_W + wallT * 2, wallT, wallH);
  pop();

  // left wall
  push();
  translate(-FIELD_W / 2 - wallT / 2, 0, wallH / 2);
  box(wallT, FIELD_H, wallH);
  pop();

  // right wall
  push();
  translate(FIELD_W / 2 + wallT / 2, 0, wallH / 2);
  box(wallT, FIELD_H, wallH);
  pop();
}

function drawFieldLines() {
  const z = 12;

  // center line
  drawLineBox(0, 0, 3, FIELD_H, z);

  // center circle
  noFill();
  stroke(255);
  strokeWeight(3);

  push();
  translate(0, 0, z + 2);
  beginShape();
  const r = FIELD_H * 0.175;
  for (let a = 0; a < TWO_PI; a += 0.08) {
    vertex(cos(a) * r, sin(a) * r, 0);
  }
  endShape(CLOSE);
  pop();

  // goal boxes
  drawGoalBox(-FIELD_W / 2 + 80, 0);
  drawGoalBox(FIELD_W / 2 - 80, 0);
}

function drawLineBox(x, y, w, h, z) {
  push();
  translate(x, y, z);
  noStroke();
  fill(255);
  box(w, h, 3);
  pop();
}

function drawGoalBox(cx, cy) {
  const goalW = 140;
  const goalH = FIELD_H * 0.32;
  const z = 14;

  drawLineBox(cx, cy - goalH / 2, goalW, 3, z);
  drawLineBox(cx, cy + goalH / 2, goalW, 3, z);
  drawLineBox(cx - goalW / 2, cy, 3, goalH, z);
  drawLineBox(cx + goalW / 2, cy, 3, goalH, z);
}

function getRodXPositions() {
  const positions = [];

  for (let i = 1; i <= 6; i++) {
    const x = -FIELD_W / 2 + (FIELD_W / 7) * i;
    positions.push(x);
  }

  return positions;
}

function drawAllRods() {
  const xs = getRodXPositions();

  for (let i = 0; i < xs.length; i++) {
    drawRod(xs[i], rodCounts[i], rodTeams[i]);
  }
}

function drawRod(x, count, team) {
  const top = -FIELD_H * 0.42;
  const bottom = FIELD_H * 0.42;
  const rodLength = bottom - top;

  // metal rod
  push();
  translate(x, 0, 55);
  fill(190);
  noStroke();

  if (team === "p1") {
    
    cylinder(7, rodLength + 300);
  } else {
    cylinder(7, rodLength + 250);
  }

  pop();

  // handles
  push();
  noStroke();
  ambientMaterial(20, 30, 70);

  if (team === "p1") {
    
    push();
    translate(x, top - 180, 55);
    cylinder(14, 65);
    pop();

    push();
    translate(x, bottom + 75, 55);
    cylinder(14, 40);
    pop();

  } else {
    
    push();
    translate(x, top - 125, 55);
    cylinder(14, 20);
    pop();

    push();
    translate(x, bottom + 75, 55);
    cylinder(14, 40);
    pop();
  }
  pop();

  // foosmen
  const gap = rodLength / (count + 1);
  for (let i = 0; i < count; i++) {
    const y = top + gap * (i + 1);
    drawFoosman(x, y, team);
  }
}



function drawFoosman(x, y, team) {
  let c;
    if (team === "p1") {
    c = color(80, 160, 255);   // 파랑
    } else {
    c = color(247, 139, 213);  // 핑크
    }

  // body
  push();
  translate(x, y, 42);
  fill(c);
  noStroke();
  box(28, 22, 55);
  pop();

  // head
  push();
  translate(x, y, 82);
  fill(c);
  noStroke();
  sphere(15);
  pop();

  // small foot
  push();
  translate(x, y, 15);
  fill(c);
  noStroke();
  box(36, 18, 14);
  pop();
}