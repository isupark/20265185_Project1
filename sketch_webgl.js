

const FIELD_W = 920;
const FIELD_H = 516;

let rods = [
  { count: 1, team: "p1", x: 0, offsetY: 0, angle: 0 },
  { count: 3, team: "p2", x: 0, offsetY: 0, angle: 0 },
  { count: 4, team: "p1", x: 0, offsetY: 0, angle: 0 },
  { count: 4, team: "p2", x: 0, offsetY: 0, angle: 0 },
  { count: 3, team: "p1", x: 0, offsetY: 0, angle: 0 },
  { count: 1, team: "p2", x: 0, offsetY: 0, angle: 0 }
];


//Drawing Field

function setup() {
  createCanvas(1000, 600, WEBGL);

  const rodsX = getRodXPositions();
  for (let i = 0; i < rods.length; i++){
    rods[i].x = rodsX[i];
  }
  
}

function draw() {
  background(30);

  // camera fixed
  camera(0, -720, 620, 0, 0, 0, 0, 0, -1);

  ambientLight(120);
  directionalLight(255, 255, 255, -0.5, 0.8, -1);

  updateSelectedRod();

  drawTable();
  drawFieldLines();
  drawAllRods();
}

function drawTable() {

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
  drawGoalBox(-FIELD_W / 2 + 40, 0);
  drawGoalBox(FIELD_W / 2 - 40, 0);
}

function drawLineBox(x, y, w, h, z) {
  push();
  translate(x, y, z);
  noStroke();
  fill(255);
  box(w, h, 2);
  pop();
}

function drawGoalBox(cx, cy) {
  const goalW = FIELD_W* 0.1;
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

//Drawing Rods, Foosmen

const Rod_Z = 55; 
const Rod_RADIUS = 7;
const Handle_RADIUS = 14; 

const Rod_Top_RATIO = 0.42; 
const Rod_Bottom_RATIO = 0.42;



function drawAllRods() {

  for (let i = 0; i < rods.length; i++) {
    
    drawRodGroup(rods[i], i);
  }
}

function drawRodGroup(rod, index) {
    // const x = rod.x;
    // const count = rod.count;
    // const team = rod.team;
    const selectedRod = getSelectedRod();
    const isSelected = index === selectedRod;

    const top = -FIELD_H * Rod_Top_RATIO;
    const bottom = FIELD_H * Rod_Bottom_RATIO ;
    const rodLength = bottom - top;

  // rod group translate
    push();

    translate(rod.x, rod.offsetY, Rod_Z);
    rotateY(rod.angle);

    drawMetalRod(rod, rodLength);
    drawHandle(rod,top,bottom, isSelected);
    drawAllFoosmen(rod, top, rodLength);

    pop();

}

function drawMetalRod(rod, rodLength){
    fill(190);
    noStroke();

    if (rod.team === "p1") {
        
        cylinder(Rod_RADIUS, rodLength + 300);
    } else {
        cylinder(Rod_RADIUS, rodLength + 250);
    }
}

//Handle
function drawHandle(rod, top, bottom, isSelected){
    
    noStroke();

    if(isSelected){
        ambientMaterial(255,77,0);
    } else {
        ambientMaterial(20, 30, 70);
    }
    
    
    if (rod.team === "p1") {
    
    push();
    translate(0, top - 180, 0);
    cylinder(Handle_RADIUS, 65);
    pop();

    push();
    translate(0, bottom + 150, 0);
    cylinder(Handle_RADIUS, 20);
    pop();

  } else {
    
    push();
    translate(0, top - 125, 0);
    cylinder(Handle_RADIUS, 20);
    pop();

    push();
    translate(0, bottom + 150, 0);
    cylinder(Handle_RADIUS, 40);
    pop();
  }
}

  // foosmen

  function drawAllFoosmen(rod, top, rodLength){

    const gap = rodLength / (rod.count + 1);

    for (let i = 0; i < rod.count; i++) {
        const y = top + gap * (i + 1);
        drawFoosman(0, y, rod.team);
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
  translate(x, y, 42 - Rod_Z);
  ambientMaterial(c);
  noStroke();
  box(28, 22, 55);
  pop();

  // head
  push();
  translate(x, y, 82 - Rod_Z);
  ambientMaterial(c);
  noStroke();
  sphere(15);
  pop();

  // small foot
  push();
  translate(x, y, 15 - Rod_Z);
  fill(c);
  noStroke();
  box(36, 18, 14);
  pop();
}

//Selecting Rod 

let p1RodIndexes = [4, 2, 0];
let selectedP1Rod = 1;

function getSelectedRod(){
    return p1RodIndexes[selectedP1Rod];
}

function keyPressed(){
     const previousRodIndex = getSelectedRod();

    if(keyCode ===LEFT_ARROW){
        selectedP1Rod = max(0, selectedP1Rod - 1);
  }

    if (keyCode === RIGHT_ARROW) {
        selectedP1Rod = min(p1RodIndexes.length - 1, selectedP1Rod + 1);
    }
    const newRodIndex = getSelectedRod();

    if (previousRodIndex !== newRodIndex) {
        rods[previousRodIndex].offsetY = 0;
  }
}



//Rod Moving

const  Rod_Speed = 4; 

function updateSelectedRod(){
    const rodIndex = getSelectedRod();
    const rod = rods[rodIndex];

    if (keyIsDown(UP_ARROW)) {
        rod.offsetY += Rod_Speed;
    }

    if (keyIsDown(DOWN_ARROW)){
        rod.offsetY -= Rod_Speed;
    }

    const top = -FIELD_H * Rod_Top_RATIO;
    const bottom = FIELD_H * Rod_Bottom_RATIO;

    const minOffsetY = -FIELD_H / 2 - top;
    const maxOffsetY = FIELD_H / 2 - bottom;

    rod.offsetY = constrain(rod.offsetY, minOffsetY, maxOffsetY);
}