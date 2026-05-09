function drawStartOverlay(uiLayer) {
  const startTextX = uiLayer.width / 2;
  const startTextY = uiLayer.height / 2;
  const boxW = 560;
  const boxH = 90;
  const boxR = 14;

  uiLayer.push();
  uiLayer.noStroke();
  uiLayer.fill(0, 0, 0, 170);
  uiLayer.rectMode(CENTER);
  uiLayer.rect(startTextX, startTextY, boxW, boxH, boxR);

  uiLayer.fill(255);
  uiLayer.textAlign(CENTER, CENTER);
  uiLayer.textSize(26);
  uiLayer.text("Press Enter to Start", startTextX, startTextY);
  uiLayer.pop();
}

function renderGameUI(config) {
  const {
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
  } = config;

  uiLayer.clear();

  let elapsedSec = 0;
  if (gameState !== "start") {
    elapsedSec = floor((millis() - gameStartTime - pausedTime) / 1000);
  }

  const remainingTime = max(0, gameTime - elapsedSec);
  const minText = floor(remainingTime / 60);
  const secText = String(remainingTime % 60).padStart(2, "0");

  uiLayer.imageMode(CENTER);
  const scoreUIW = 360;
  const scoreUIRatio = scoreUIImg.width / scoreUIImg.height;
  const scoreUIH = scoreUIW / scoreUIRatio;
  uiLayer.image(scoreUIImg, uiLayer.width / 2, 35, scoreUIW, scoreUIH);

  uiLayer.imageMode(CORNER);
  const timerUIW = 230;
  const timerUIRatio = timerUIImg.width / timerUIImg.height;
  const timerUIH = timerUIW / timerUIRatio;
  uiLayer.image(timerUIImg, 10, 6, timerUIW * 0.8, timerUIH * 0.8);

  uiLayer.textFont(gameFont);
  uiLayer.fill(255);
  uiLayer.textAlign(CENTER, CENTER);
  uiLayer.textSize(14);
  uiLayer.text(scoreP1 + " : " + scoreP2, uiLayer.width / 2, 32);

  uiLayer.textAlign(LEFT, CENTER);
  uiLayer.textSize(13);
  uiLayer.text("TIME " + minText + ":" + secText, 80, 34);

  if (gameState === "start") {
    drawStartOverlay(uiLayer);
  }

  if (gameState === "gameover") {

    const elapsedGameOver = millis() - gameOverStartTime;

    uiLayer.textAlign(CENTER, CENTER);

    if (elapsedGameOver < 1000) {
      uiLayer.textSize(40);
      uiLayer.fill(255);
      uiLayer.text("GAME OVER", uiLayer.width / 2, uiLayer.height / 2);
    } else {
      uiLayer.imageMode(CENTER);

      let resultImg;
      if (scoreP1 === scoreP2) {
        resultImg = drawImg;
      } else if (scoreP1 > scoreP2) {
        resultImg = winImg;
      } else {
        resultImg = loseImg;
      }

      const resultW = 600;
      const resultRatio = resultImg.width / resultImg.height;
      const resultH = resultW / resultRatio;

      uiLayer.image(
        resultImg,
        uiLayer.width / 2,
        uiLayer.height / 2,
        resultW,
        resultH
      );
    }
  }

  const isTimeOver = remainingTime <= 0;
  return { isTimeOver };
}

function renderGoalEffectUI(config) {
  const {
    uiLayer,
    goalImg,
    goalStartTime,
    goalShowTime
  } = config;

  const elapsed = millis() - goalStartTime;
  const pulseScale = 1 + sin(frameCount * 0.25) * 0.08;
  const imgW = 1260 * pulseScale;
  const imgH = 660 * pulseScale;

  uiLayer.imageMode(CENTER);
  uiLayer.image(goalImg, uiLayer.width / 2, uiLayer.height / 2, imgW, imgH);

  const isFinished = elapsed > goalShowTime;
  return { isFinished };
}
