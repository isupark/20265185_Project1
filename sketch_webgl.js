


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

let nextServerTeam = "p1";

let gameState = "start";
let gameTime = 120; 
let gameStartTime = 0;
let pausedTime = 0;
let goalPauseStart = 0;
let gameFont;

let scoreP1 = 0; 
let scoreP2 = 0;


const goalW = FIELD_W* 0.1;
const goalH = FIELD_H * 0.32;
const goalz = 14;

let goalImg;
let scoreUIImg;
let timerUIImg;
let winImg;
let loseImg;
let drawImg;
let uiLayer;
let mainCanvas;

let isGoal = false;
let goalStartTime = 0;
const goalShowTime = 2000;
let gameOverStartTime = 0;

const OPPONENT_KICK_COOLDOWN = 800;
let lastOpponentKickTime = 0;

function preload(){
    goalImg = loadImage("goal.png");
    scoreUIImg = loadImage("scoreUI.png");
    timerUIImg = loadImage("Timer.png");
    winImg = loadImage("win.png");
    loseImg = loadImage("lose.png");
    drawImg = loadImage("draw.png");

    gameFont = loadFont("PressStart2P.ttf");
}

// --- Ball ---

let ball = {
  x: 0,
  y: 0,
  z: 20,
  r: 17,
  vx: 0,
  vy: 0
};

function drawBall(){
    push();
    translate(ball.x, ball.y, ball.z);
    fill(255);
    noStroke();
    sphere(ball.r);
    pop();
}

function updateBall(){

    if (isGoal) return; 

    ball.x += ball.vx;
    ball.y += ball.vy;

    const speed = abs(ball.vx) + abs(ball.vy);

  if (speed > 0.2) {
    checkBallFoosmanCollision();
  }

   checkGoal();

    const left = -FIELD_W / 2 + ball.r;
    const right = FIELD_W / 2 - ball.r;
    const topWall = -FIELD_H / 2 + ball.r;
    const bottomWall = FIELD_H / 2 - ball.r;

    if (ball.x < left || ball.x > right) {
        ball.vx *= -1;
    }

    if (ball.y < topWall || ball.y > bottomWall) {
        ball.vy *= -1;
    }

    ball.x = constrain(ball.x, left, right);
    ball.y = constrain(ball.y, topWall, bottomWall);

    ball.vx *= 0.99;
    ball.vy *= 0.99;

    keepBallMoving();
}

function keepBallMoving() {
  const minSpeed = 0.7;
  const speed = sqrt(ball.vx * ball.vx + ball.vy * ball.vy);

  if (speed > 0 && speed < minSpeed) {
    const scale = minSpeed / speed;

    ball.vx *= scale;
    ball.vy *= scale;
  }
}





// --- Field·Canvas ---

function setup() {
  mainCanvas = createCanvas(1000, 600, WEBGL);
  uiLayer = createGraphics(1000, 600);
  uiLayer.clear();

  // WEBGL 캔버스와 별개인 2D HUD 캔버스를 DOM 오버레이로 고정한다.
  const parent = mainCanvas.elt.parentElement || document.body;
  if (parent.style.position === "") {
    parent.style.position = "relative";
  }
  parent.appendChild(uiLayer.canvas);
  uiLayer.canvas.style.position = "absolute";
  uiLayer.canvas.style.left = "0px";
  uiLayer.canvas.style.top = "0px";
  uiLayer.canvas.style.width = `${width}px`;
  uiLayer.canvas.style.height = `${height}px`;
  uiLayer.canvas.style.zIndex = "9999";
  uiLayer.canvas.style.display = "block";
  uiLayer.canvas.style.pointerEvents = "none";

  const rodsX = getRodXPositions();
  for (let i = 0; i < rods.length; i++){
    rods[i].x = rodsX[i];
  }

  resetBallServer(nextServerTeam);
  
}

function draw() {
  syncUILayerPosition();
  background(30);

  
  camera(0, -720, 620, 0, 0, 0, 0, 0, -1);

  ambientLight(120);
  directionalLight(255, 255, 255, -0.5, 0.8, -1);

  if (gameState === "playing") {
    updatePlayingWorld();
  }

  drawTable();
  drawFieldLines();
  drawAllRods();
  drawBall();

  drawUI();

  if (isGoal) {
    const goalResult = renderGoalEffectUI({
      uiLayer,
      goalImg,
      goalStartTime,
      goalShowTime
    });

    if (goalResult.isFinished) {
      pausedTime += millis() - goalPauseStart;
      isGoal = false;
      resetBallServer(nextServerTeam);
      gameState = "playing";
    }
  }
  
}

// --- 플레이 중 물리·입력 한 틱 ---
function updatePlayingWorld() {
  updateSelectedRod();
  updateOpponentPlayer();
  updateBall();
}

function syncUILayerPosition() {
  if (!mainCanvas || !mainCanvas.elt || !uiLayer || !uiLayer.canvas) return;

  const rect = mainCanvas.elt.getBoundingClientRect();
  uiLayer.canvas.style.left = `${rect.left + window.scrollX}px`;
  uiLayer.canvas.style.top = `${rect.top + window.scrollY}px`;
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
 

  drawLineBox(cx, cy - goalH / 2, goalW, 3, goalz);
  drawLineBox(cx, cy + goalH / 2, goalW, 3, goalz);
  drawLineBox(cx - goalW / 2, cy, 3, goalH, goalz);
  drawLineBox(cx + goalW / 2, cy, 3, goalH, goalz);
}


// --- Rod X Position ---
function getRodXPositions() {
  const positions = [];

  for (let i = 1; i <= 6; i++) {
    const x = -FIELD_W / 2 + (FIELD_W / 7) * i;
    positions.push(x);
  }

  return positions;
}

// --- Drawing Rods·Foosmen ---

const Rod_Z = 55; 
const Rod_RADIUS = 7;
const Handle_RADIUS = 14; 

const Rod_Top_RATIO = 0.54; 
const Rod_Bottom_RATIO = 0.54;

const RodTop = -FIELD_H * Rod_Top_RATIO;
const RodBottom = FIELD_H * Rod_Bottom_RATIO;
const rodLength = RodBottom - RodTop;



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

    const handleLimit = 41;
    const rodBodyOffsetY = constrain(rod.offsetY, -handleLimit, handleLimit);



  // rod group translate
    push();

    translate(rod.x, rodBodyOffsetY, Rod_Z);
    rotateY(rod.angle);

    drawMetalRod(rod, rodLength);
    drawHandle(rod, RodTop, RodBottom, isSelected);

    pop();

    push();

    // foosmen은 실제 offsetY 전체만큼 이동
    translate(rod.x, rod.offsetY, Rod_Z);
    rotateY(rod.angle);

    drawAllFoosmen(rod, RodTop, rodLength);

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
function drawHandle(rod, RodTop, RodBottom, isSelected){
    
    noStroke();

    if(isSelected){
        ambientMaterial(255,77,0);
    } else {
        ambientMaterial(20, 30, 70);
    }
    
    
    if (rod.team === "p1") {
    
    push();
    translate(0, RodTop - 180, 0);
    cylinder(Handle_RADIUS, 65);
    pop();

    push();
    translate(0, RodBottom + 150, 0);
    cylinder(Handle_RADIUS, 20);
    pop();

  } else {
    
    push();
    translate(0, RodTop - 125, 0);
    cylinder(Handle_RADIUS, 20);
    pop();

    push();
    translate(0, RodBottom + 150, 0);
    cylinder(Handle_RADIUS, 40);
    pop();
  }
}

  // foosmen

  function drawAllFoosmen(rod, RodTop, rodLength){

    const gap = rodLength / (rod.count + 1);

    for (let i = 0; i < rod.count; i++) {
        const y = RodTop + gap * (i + 1);
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

// --- Selecting Rod ---

let p1RodIndexes = [4, 2, 0];
let p2RodIndexes = [1, 3, 5];
let selectedP1Rod = 1;

function getSelectedRod(){
    return p1RodIndexes[selectedP1Rod];
}

function keyPressed(){
    if (keyCode === ENTER && gameState === "start") {
 
    gameState = "playing";
    gameStartTime = millis();
    pausedTime = 0;
  }

     const previousRodIndex = getSelectedRod();

    if(keyCode ===LEFT_ARROW){
        inputState.left = true;
        selectedP1Rod = max(0, selectedP1Rod - 1);
  }

    if (keyCode === RIGHT_ARROW) {
        inputState.right = true;
        selectedP1Rod = min(p1RodIndexes.length - 1, selectedP1Rod + 1);
    }
    const newRodIndex = getSelectedRod();

    if (previousRodIndex !== newRodIndex) {
        rods[previousRodIndex].offsetY = 0;
  }
    if (key === ' ' && !isChargingRotation) {

        inputState.kick = true;
        spacePressedTime = millis();
        isChargingRotation = true;
  }

}



// --- Rod (Slide) Moving ---

const  Rod_Speed = 4; 

function updateSelectedRod(){
    const rodIndex = getSelectedRod();
    const rod = rods[rodIndex];

    inputState.up = keyIsDown(UP_ARROW);
    inputState.down = keyIsDown(DOWN_ARROW);

    if (keyIsDown(UP_ARROW)) {
        rod.offsetY += Rod_Speed;
    }

    if (keyIsDown(DOWN_ARROW)){
        rod.offsetY -= Rod_Speed;
    }

    
    const limits = getRodMoveLimits(rod);
    rod.offsetY = constrain(rod.offsetY, limits.min, limits.max);
}

function getRodMoveLimits(rod){
    const gap = rodLength / (rod.count +1);

    const firstFoosmanY = RodTop+ gap;
    const lastFoosmanY = RodTop + gap * rod.count;

    const topWall = -FIELD_H / 2;
    const bottomWall = FIELD_H / 2;

    const minOffsetY = topWall - firstFoosmanY +30;
    const maxOffsetY = bottomWall - lastFoosmanY -30;

    return {
        min: minOffsetY,
        max: maxOffsetY
    };
    }



// --- Rod (Rotation)·Kick Input ---

let spacePressedTime = 0;
let isChargingRotation = false; 

function keyReleased(){
     if(keyCode === LEFT_ARROW){
        inputState.left = false;
    }

    if(keyCode === RIGHT_ARROW){
        inputState.right = false;
    }

    if (key === ' ') {
        inputState.kick = false;
    }

    if (key === ' ' && isChargingRotation){

        const pressDuration = millis() - spacePressedTime;

        rotateSelectedRod(pressDuration);
        kickSelectedRod(pressDuration)

        if (canSelectedKick()) {
            console.log("kick possible");
        } else {
            console.log("too far");
        }

        isChargingRotation = false;
    }
}

function getKickStrength(duration) {
  if (duration < 200) {
    return {
      angleDeg: -15,
      speed: 5
    };
  } else if (duration < 400) {
    return {
      angleDeg: -45,
      speed: 8
    };
  } else {
    return {
      angleDeg: -90,
      speed: 12
    };
  }
}



function rotateSelectedRod(duration) {
  const rod = rods[getSelectedRod()];
  const kick = getKickStrength(duration);

  rod.angle += radians(kick.angleDeg);

  setTimeout(() => {
    rod.angle = 0;
  }, 120);
}




// --- Ball Server ---

function getServerRod(team){
    if (team =="p1"){
        return {
            rodIndex : 2, 
            serverOffsetX : 45
        };
    }else {
        return {
            rodIndex : 3, 
            serverOffsetX : -45
        }; 
    }
}

function resetBallServer(team){
    const serverRod = getServerRod(team);
    const rod = rods[serverRod.rodIndex];
   

    const centerFoosmenY = RodTop + rodLength/2

    ball.x = rod.x + serverRod.serverOffsetX;
    ball.y = centerFoosmenY + rod.offsetY;
    ball.z = 20;

    ball.vx = 0;
    ball.vy = 0;
}

// --- 킥·푸스맨 위치·충돌 ---

const KICK_RANGE = 65 ;
const FOOSMAN_COLLI_RADIUS = 28;

function getFoosmanPosition(rod){
    const positions = [];
    const gap = rodLength / (rod.count +1);

    for ( let i = 0; i < rod.count; i++){
        const localY = RodTop + gap * (i + 1);

        positions.push({
            x : rod.x, 
            y: localY + rod.offsetY
        });
    }
    return positions;

}

function getNearestFoosman(rod){
    const foosmen = getFoosmanPosition(rod);

    let nearest = null; 
    let nearestDist = Infinity;

    for (let i =0; i < foosmen.length; i++){
        const f = foosmen[i];
        const d = dist(ball.x, ball.y, f.x, f.y);

        if (d < nearestDist){
            nearestDist = d;
            nearest = f;
        }
    }
    return {
        foosman : nearest, 
        distance : nearestDist
    };
}

function canSelectedKick(){
    const rod = rods[getSelectedRod()];
    const result = getNearestFoosman(rod);

    return result.distance < KICK_RANGE;

}

function kickSelectedRod(duration) {

   const rod = rods[getSelectedRod()];
  const result = getNearestFoosman(rod);

  if (result.distance > KICK_RANGE) return;

  const kick = getKickStrength(duration);

  let dxDirection;

    if (rod.team === "p1") {
    dxDirection = 1;
    } else {
    dxDirection = -1;
    }
  const hitOffsetY = ball.y - result.foosman.y;

  ball.vx = kick.speed * dxDirection;
  ball.vy = constrain(hitOffsetY * 0.25, -4, 4);
}

function checkBallFoosmanCollision() {
  for (let i = 0; i < rods.length; i++) {
    const rod = rods[i];
    const foosmen = getFoosmanPosition(rod);

    for (let j = 0; j < foosmen.length; j++) {
      const f = foosmen[j];
      const d = dist(ball.x, ball.y, f.x, f.y);

      if (d < ball.r + FOOSMAN_COLLI_RADIUS) {
        resolveBallFoosmanCollision(f);
      }
    }
  }
}

function resolveBallFoosmanCollision(foosman) {
  const dx = ball.x - foosman.x;
  const dy = ball.y - foosman.y;
  let d = sqrt(dx * dx + dy * dy);

  if (d < 0.001) {
    dx = random(-1, 1);
    dy = random(-1, 1);
    d = sqrt(dx * dx + dy * dy);
  }

  const minDist = ball.r + FOOSMAN_COLLI_RADIUS;

  // 정규화된 밀어내기 방향
  const nx = dx / d;
  const ny = dy / d;

  // 공을 foosman 밖으로 밀어냄
  ball.x = foosman.x + nx * minDist;
  ball.y = foosman.y + ny * minDist;

  // 튕기는 속도 부여
  const speed = max(2.5, sqrt(ball.vx * ball.vx + ball.vy * ball.vy));

  ball.vx = nx * speed;
  ball.vy = ny * speed;
}


// --- Goal ---

function checkGoal() {
  const leftGoalX = -FIELD_W / 2 + 40;
  const rightGoalX = FIELD_W / 2 - 40;

  const isInGoalY =
    ball.y > -goalH / 2 &&
    ball.y < goalH / 2;

  const isInLeftGoalBox =
    ball.x > leftGoalX - goalW / 2 &&
    ball.x < leftGoalX + goalW / 2 &&
    isInGoalY;

  const isInRightGoalBox =
    ball.x > rightGoalX - goalW / 2 &&
    ball.x < rightGoalX + goalW / 2 &&
    isInGoalY;

  
  if (isInLeftGoalBox) {
    scoreP2++;
    startGoalEffect("p1");
  }

  if (isInRightGoalBox) {
    scoreP1++;
    startGoalEffect("p2");
  }
}

function startGoalEffect(serverTeam) {
  gameState = "goal";

  goalPauseStart = millis();
  isGoal = true;
  goalStartTime = millis();
  nextServerTeam = serverTeam;

  ball.vx = 0;
  ball.vy = 0;
}

// --- UI (ui.js) ---

function drawUI() {
  const uiResult = renderGameUI({
    uiLayer,
    gameState,
    gameStartTime,
    pausedTime,
    gameTime,
    scoreP1,
    scoreP2,
    scoreUIImg,
    timerUIImg,
    gameFont
  });

    drawInputOverlay();

  if (uiResult.isTimeOver && gameState === "playing") {
    gameState = "gameover";
    gameOverStartTime = millis();
    ball.vx = 0;
    ball.vy = 0;
  }
}


// --- 상대(Opponent) Player ---

function moveOpponentRod(rod){
    const opponentSpeed = 2.2
    const nearestFoosman = getNearestFoosmanOnRod(rod);

    if(nearestFoosman ===null) return; 

    const targetY = ball.y;
    const currentY = nearestFoosman.y;

    if (currentY < targetY) {
        rod.offsetY += opponentSpeed;
    } else if (currentY > targetY) {
        rod.offsetY -= opponentSpeed;
    }

    const limits = getRodMoveLimits(rod);
    rod.offsetY = constrain(rod.offsetY, limits.min, limits.max);

}

function getClosestOpponentRodToBall() {
  let closestRod = null;
  let closestDist = Infinity;

  for (let i = 0; i < p2RodIndexes.length; i++) {
    const rodIndex = p2RodIndexes[i];
    const rod = rods[rodIndex];

    const d = abs(ball.x - rod.x);

    if (d < closestDist) {
      closestDist = d;
      closestRod = rod;
    }
  }

  return closestRod;
}


// --- Nearest Foosman on Rod ---
function getNearestFoosmanOnRod(rod) {
  const foosmen = getFoosmanPosition(rod);

  let nearest = null;
  let nearestDist = Infinity;

  for (let i = 0; i < foosmen.length; i++) {
    const f = foosmen[i];

    // y 차이만 비교
    const d = abs(ball.y - f.y);

    if (d < nearestDist) {
      nearestDist = d;
      nearest = f;
    }
  }

  return nearest;
}

function updateOpponentPlayer() {
  const targetRod = getClosestOpponentRodToBall();

  if (targetRod === null) return;

  moveOpponentRod(targetRod);
  tryOpponentKick(targetRod);
}

function tryOpponentKick(rod) {

    const now = millis();

    if (now - lastOpponentKickTime < OPPONENT_KICK_COOLDOWN) {
        return;
    }

  const result = getNearestFoosman(rod);

  if (result.distance < KICK_RANGE) {

    console.log("opponent kick")
    
    lastOpponentKickTime = now;
    
    const kickSpped = 8;
    ball.vx = -kickSpped;

    const hitOffsetY = ball.y - result.foosman.y;
    ball.vy = constrain(hitOffsetY * 0.25, -4, 4);

    rod.angle = radians(45);

    setTimeout(() => {
      rod.angle = 0;
    }, 120);
  }
}


//---Inpu Overlay---

let inputState = {
  left: false,
  right: false,
  up: false,
  down: false,
  kick: false
};


function drawInputOverlay() {
  uiLayer.push();

const panelW = 250;
const panelH = 135;

const x = width - panelW ;
const y = height - panelH  + 60;

  uiLayer.textFont(gameFont);
  uiLayer.textAlign(CENTER, CENTER);

  const overlayPanelX = x - 30;
  const overlayPanelY = y - 65;
  const overlayPanelW = 250;
  const overlayPanelH = 100;

  const chargeBarH = 16;
  const chargeGapAbovePanel = 10;
  const chargeBarY = overlayPanelY - chargeGapAbovePanel - chargeBarH;
  const chargeBarWidthRatio = 0.95;
  const chargeBarW = overlayPanelW * chargeBarWidthRatio;
  const chargeBarX = overlayPanelX + (overlayPanelW - chargeBarW) / 2;

  drawKickChargeBar(chargeBarX, chargeBarY, chargeBarW, chargeBarH);

  drawOverlayPanel(overlayPanelX, overlayPanelY, overlayPanelW, overlayPanelH);

  drawKeyButton(x + 45, y - 35, "↑", inputState.up, 38, 38);
  drawKeyButton(x, y + 5, "←", inputState.left, 38, 38);
  drawKeyButton(x + 45, y + 5, "↓", inputState.down, 38, 38);
  drawKeyButton(x + 90, y + 5, "→", inputState.right, 38, 38);

  drawKeyButton(x + 170, y + 5, "KICK", inputState.kick, 78, 38);

//   uiLayer.fill(255, 220);
//   uiLayer.noStroke();
//   uiLayer.textSize(8);
//   uiLayer.text("INPUT", x + 85, y - 55);

  uiLayer.pop();
}

function drawOverlayPanel(x, y, w, h) {
  uiLayer.push();

  uiLayer.noStroke();
  uiLayer.fill(0, 130);
  uiLayer.rect(x + 4, y + 4, w, h, 16);

  uiLayer.fill(15, 25, 45, 50);
  uiLayer.stroke(80, 180, 255, 180);
  uiLayer.strokeWeight(2);
  uiLayer.rect(x, y, w, h, 16);

  uiLayer.pop();
}

function drawKeyButton(x, y, label, active, w, h) {
  uiLayer.push();

  uiLayer.rectMode(CENTER);
  uiLayer.textAlign(CENTER, CENTER);
  uiLayer.textSize(10);

  if (active) {
    uiLayer.fill(255, 120, 30);
    uiLayer.stroke(255, 230, 120);
    uiLayer.strokeWeight(3);
  } else {
    uiLayer.fill(25, 35, 60);
    uiLayer.stroke(120, 150, 190);
    uiLayer.strokeWeight(2);
  }

  uiLayer.rect(x, y, w, h, 8);

  if (active) {
    uiLayer.fill(20);
  } else {
    uiLayer.fill(230);
  }

  uiLayer.noStroke();
  uiLayer.text(label, x, y + 1);

  uiLayer.pop();
}


//---chargebar ---

function drawKickChargeBar(x, y, w, h) {
  uiLayer.push();

  let charge = 0;

  if (isChargingRotation) {
    const duration = millis() - spacePressedTime;
    charge = constrain(duration / 600, 0, 1);
  }

  uiLayer.noStroke();
  uiLayer.fill(255, 220);
  uiLayer.textSize(7);
  uiLayer.textAlign(LEFT, CENTER);
  uiLayer.text("KICK CHARGE", x, y - 9);

  uiLayer.fill(10, 15, 30, 230);
  uiLayer.rect(x, y, w, h, 8);

  if (charge > 0) {
    uiLayer.fill(255, 120, 30);
    uiLayer.rect(x, y, w * charge, h, 8);
  }

  uiLayer.noFill();
  uiLayer.stroke(255, 230, 120, 180);
  uiLayer.strokeWeight(1.5);
  uiLayer.rect(x, y, w, h, 8);

  // 3단계 기준선
  uiLayer.stroke(255, 255, 255, 120);
  uiLayer.strokeWeight(1);

  const mark1 = x + w * (200 / 600);
  const mark2 = x + w * (400 / 600);

  uiLayer.line(mark1, y, mark1, y + h);
  uiLayer.line(mark2, y, mark2, y + h);

  uiLayer.pop();
}