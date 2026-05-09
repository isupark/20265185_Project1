# Project1


- **Name**: Jisu Park
- **Student ID**: 20265185  
- **Repository URL** : https://github.com/isupark/20265185_Project1.git
- **Youtube Link** : 

## 1. Description of the Game 

## 2. Description of the Code 

[Component Drawing]

Step 1. 2D Field 구현 (sketch.js) → p5.js WEBGL을 사용해 3D Field로 확장 (sketch_webgl.js)
- Field, wall, center line, goal box를 3D 오브젝트로 구현함.
- rod와 foosmen의 위치를 3D 좌표계 기준으로 배치함.

Step 2. Rod와 foosmen 구조 객체화
- 초기 코드에는 rodCounts, rodTeams, x positions를 각각 따로 관리했음.
- 이후 rods 객체 배열을 생성하여 rod 하나의 정보를 하나의 객체로 관리함.
- 각 rod 객체는 다음 값을 가짐:
  { count: 4, team: "p2", x: 0, offsetY: 0, angle: 0 }

    여기서:
    - count: foosmen 개수
    - team: player 구분
    - x: rod의 x축 위치
    - offsetY: rod의 상하 이동값
    - angle: rod의 회전값

Step 3. Rod 그룹 구조 생성
- drawAllRods()에서 rod 객체 하나씩 drawRodGroup()으로 전달함.
- drawRodGroup() 안에서 push()/pop()을 사용해 rod, handle, foosmen을 하나의 그룹처럼 그림.
- 특히, translate(rod.x, rod.offsetY, Rod_Z)와 rotateY(rod.angle)을 그룹 전체에 적용함.

Step 4. Rod 선택 기능 구현
- Player 1의 rod 3개를 좌우 방향키로 선택 rod를 변경함.
- 선택된 rod는 isSelected 값으로 판단함.
- 선택된 handle은 색상 변화를 통해 시각적으로 강조함.

Step 5. Rod 상하 이동 구현
- 위/아래 방향키를 누르고 있는 동안 선택된 rod의 offsetY 값을 변경함.
- constrain()을 사용해 foosmen이 field 벽에 닿는 범위를 넘지 않도록 제한함.
- 다른 rod로 선택이 이동되면 이전 rod의 offsetY를 0으로 되돌려 기본 위치로 복귀시킴.

[Mechanics]

Step 1. Ball 객체 생성 후 시작 지점, 이동 및 충돌 
- drawBall()을 통해 WEBGL 공간에 sphere 형태로 공을 그림.
- updateBall()에서 속도 기반으로 공 위치를 업데이트함.
- 좌우/상하 벽 충돌 시 속도를 반전시켜 공이 튕기도록 구현함.
- friction을 적용하여 공 속도가 점차 감소하도록 구현함.
- foosman과 충돌 시 공 속도를 반전시켜 foosman을 통과하지 않고 튕기도록 구현함.
- getServerRod()와 resetBallServer()를 사용해 새로운 play 마다 팀별 serve 위치에서 공이 시작되도록 구현함.

Step 2. Foosman 위치 계산 구조 
- getFoosmanPositionsOnRod()를 구현하여 rod 상태로부터 각 foosman의 실제 world position을 계산함.
- 이후 공 충돌, kick 판정, AI 로직 등에 활용 가능한 좌표 기반 구조를 생성함.


Step 3. Kick 가능 범위 및 Kick 입력  (rod 회전)
- getNearestFoosmanToBall()을 통해 공과 가장 가까운 foosman을 탐색함.
- 공과 foosman 사이 거리가 KICK_RANGE 이내일 경우 kick 가능한 상태로 판단함.
- Spacebar 입력 시간을 기반으로 kick 강도를 3단계로 구분함. (이후 mcu 6050 회전 강도에 따라 3단계 구분)
- rotateSelectedRod()에서 rod 회전 animation을 구현.

Step 4. Ball Kick, 방향 
- kick 가능한 범위 내에서 공 속도를 변경하여 공이 이동하도록 구현함.
- 팀 방향에 따라 Player 1은 오른쪽, Player 2는 왼쪽 방향으로 공이 이동하도록 구현함.
- 공과 foosman 중심의 y축 차이를 이용해 직선 슛과 대각선 방향 kick을 구현함.


Step 10. Goal Detection 
- goal opening 영역에서는 좌우 벽 충돌을 비활성화함.
- 골대 box 범위 내에 공이 들어오면 goal로 인식함.
- Goal 발생 시 score 증가 및 serve reset.

[UI]

Step 1. Score 및 Timer UI 구현

- score, timer, game state text 등을 경기장과 독립적인 2D 화면 좌표 기준으로 렌더링함.
- image(uiLayer, 0, 0)를 사용해 최종적으로 WEBGL 화면 위에 overlay 형태로 UI를 출력함.
- 현재 scoreP1, scoreP2 값을 실시간으로 화면에 표시함.
- gameStartTime과 millis()를 기반으로 남은 경기 시간을 계산함.
- Goal animation 동안 pausedTime을 누적하여 timer가 감소하지 않도록 구현함.

Step 2. Game State 기반 UI 흐름 구현

- gameState 값을 기준으로 start, playing, goal, gameover 상태를 구분함.
- Start 상태에서는 “Press Enter to Start” 안내 UI를 표시함.
- Playing 상태에서는 score 및 timer UI를 지속적으로 업데이트함.
- Goal 상태에서는 goal overlay animation을 출력함.
- Gameover 상태에서는 최종 결과 화면으로 전환함.


## 3. Issues 
1. 두 player foosmen이 닿지 않는 거리(사각지대)에 공이 멈출 경우. 
    : 공의 마찰 구현에서 공이 완전히 멈추지 않고 아주 낮은 속도로 계속 이동하는 방식으로 해결함. 
2. Webgl 모드와 UI 화면 모드 분리 (AI help)
      : 
      - WEBGL 기반 3D 경기장과 별도로 UI 전용 graphics layer(uiLayer)를 생성하여, UI를 WEBGL 캔버스 안에서 그리는 방식 대신, createGraphics()로 만든 별도 2D 오버레이 캔버스(uiLayer.canvas)로 분리함.
      - draw()마다 mainCanvas.getBoundingClientRect() 기준으로 UI 레이어 위치를 동기화해서 캔버스와 정확히 겹치게 유지
    
3. 공의 충돌 처리에서 공의 위치가 foosman의 위치가 일치할때 공이 갖히는 상황 발생 
    : 공의 속도를 반전시키고 위치를 foosman 밖으로 밀어내서 겹쳐지는 현상 해결함.
4. Oppenent Player 의 Kick이 매 프래임마다 되어 너무 강한 플레이
:  



## 4. Acknowledge of help 
AI help 
[Compotnent]
- Webgl에서 원기둥 도형의 z 축 방향 설정, camera, light 설정. 
- drawing center circle
- 객체 배열을 생성하고 drawRod()에서 rod 객체 하나로 rod의 모든 정보를 사용하게 만들게 하는 코드 구조 수정 
- 기존에 분리되어있었던 rod, handle, foosmen 생성 함수를 drawRodGroup() 을 통해 그룹으로 적용하여 생성하도록 코드 update

- handle Select하는 Logic에 Keypressed() 함수 수정 - p1RodIndexes 를 벗어나는 입력 범위 안정적으로 처리 위한 코드 수정.(using max, min)
- 다른  rod 선택 시, 이전 Rod offsetY 위치 0으로 되돌리기.

- foosmen이 field 벽에 닿는 범위를 넘지 않도록 제한하기 위해 constrain() 함수 생성.

[Mechanics]
- 공 충돌 방향, 속도 계산 
- goal 이후 server player 관리 및 공 위치 변경
- Foosman 위치 계산 구조 생성
- 상대 player 자동 움직임 구현시 가까운 rod, fossmen 찾는 logic 생성, rod 이동, kick 간격 조정
- Goal animation 동안 pausedTime을 누적하여 timer가 감소하지 않도록 수정.


[UI]
- WEBGL 기반 3D 경기장과 별도로 UI 전용 graphics layer(uiLayer)를 생성
- Timer 에서 goal 화면 연출 제외하고 gamestate = playing 일떄만 timer 작동 하도록 수정. 
- UI 관련 기능들 파일 분리하며 renderGameUI 함수 생성 



