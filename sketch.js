
//Field 

const BASE_WIDTH = 1000;
const BASE_HEIGHT = 600;
const rodCounts = [1, 3, 4, 4, 3, 1];
const rodTeams = ["p1", "p2","p1", "p2","p1", "p2"];

const fieldRatio = {
    x: 0.04, 
    y: 0.07, 
    w: 0.92, 
    h: 0.86 
}

const goalRatio = {
  w: 0.03,   
  h: 0.25    
};

function getField() {
  return {
    x: fieldRatio.x * width,
    y: fieldRatio.y * height,
    w: fieldRatio.w * width,
    h: fieldRatio.h * height
  };
}

function getGoals() {
  const f = getField();

  const goalW = f.w * goalRatio.w;
  const goalH = f.h * goalRatio.h;
  const goalY = f.y + f.h / 2 - goalH / 2;

  return {
    left: {
      x: f.x,
      y: goalY,
      w: goalW,
      h: goalH
    },
    right: {
      x: f.x + f.w - goalW,
      y: goalY,
      w: goalW,
      h: goalH
    }
  };
}




//draw 

function setup() {
  createCanvas(1000, 600);
}

function draw() {
  background(30);

  drawField();
  drawCenterLine();
  drawCenterCircle();
  drawGoals();
  drawAllRods();
}


function drawField() {
    const f = getField();

    fill(1, 50, 32);
    noStroke();
    rect(f.x, f.y, f.w, f.h);

    noFill();
    stroke(255);
    strokeWeight(0.005 * width);
    rect(f.x, f.y, f.w, f.h);
}

function drawCenterLine(){
    const f = getField();

    const cx = f.x + f.w /2 ; 

    stroke(255);
    strokeWeight(3);

    line(cx, f.y, cx, f.y + f.h);

}

function drawCenterCircle(){
    const f = getField();

    const cx = f.x + f.w/2; 
    const cy = f.y + f.h/2 ; 

    const d = f.h *0.35; 
    
    noFill();
    stroke(255);
    strokeWeight(3);

    circle(cx,cy,d);
}



function drawGoals() {
  const goals = getGoals();

  noFill();
  stroke(255);
  strokeWeight(3);

  rect(goals.left.x, goals.left.y, goals.left.w, goals.left.h);
  rect(goals.right.x, goals.right.y, goals.right.w, goals.right.h);
}





//Road


const rodSettings = [];

for (let i = 0; i < rodCounts.length; i++) {
  rodSettings.push({
    team: rodTeams[i],
    count: rodCounts[i]
  });
}

function getRodXPositions() {
  const f = getField();

  const positions = [];

  for (let i = 1; i <= 6; i++) {
    const x = f.x + (f.w / 7) * i;
    positions.push(x);
  }

  return positions;
}

function drawRod(x, count, team) {
  const f = getField();

  const top = f.y + f.h * 0.08;
  const bottom = f.y + f.h * 0.92;
  const foosmenSize = (bottom-top) * 0.05;


  stroke(200);
  line(x, top, x, bottom);

  const gap = (bottom - top) / (count + 1);

  for (let i = 0; i < count; i++) {
    const y = top + gap * (i + 1);

    // foosman 


    if (team ==="p1"){
        fill(80, 160, 255);
    }else{
        fill(247, 139, 213);
    }

    

   // body
    rectMode(CENTER);   

    // body
    rect(
    x,
    y,
    foosmenSize * 0.8,
    foosmenSize * 2,
    foosmenSize * 0.3
    );

    // head
    stroke(255);
    strokeWeight(2);
    circle(
    x,
    y,
    foosmenSize
    );

    rectMode(CORNER);  

    }
}

function drawAllRods() {
  const xs = getRodXPositions();

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const setting = rodSettings[i];

    drawRod(x, setting.count, setting.team);
  }
}