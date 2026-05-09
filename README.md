# Project1


- **Name**: Jisu Park
- **Student ID**: 20265185  
- **Repository URL** : https://github.com/isupark/20265185_Project1.git
- **Youtube Link** : 

## 1. Description of the Game 

## 2. Description of the Code 

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



## 3. Issues 
1. 두 player foosmen이 닿지 않는 거리에 공이 멈출 경우. 
2. Webgl 모드와 UI 화면 모드 분리 (fully helped by AI)
      : UI를 WEBGL 캔버스 안에서 그리는 방식 대신, createGraphics()로 만든 별도 2D 오버레이 캔버스(uiLayer.canvas)로 분리
    uiLayer.canvas를 DOM에 직접 붙이고 position: absolute, z-index 크게 설정해 항상 위에 보이게 처리
    pointer-events: none으로 게임 입력(키/마우스) 방해하지 않게 설정
    draw()마다 mainCanvas.getBoundingClientRect() 기준으로 UI 레이어 위치를 동기화해서 캔버스와 정확히 겹치게 유지
    점수/타이머/텍스트/goal 이미지를 전부 uiLayer에만 그리도록 통일
    즉, 3D 렌더링과 UI 렌더링을 완전히 분리해서 원근/뒤집힘/깊이버퍼 영향 문제를 없앤 방식입니다.



## 4. Acknowledge of help 
AI help 
Step1 
Webgl에서 원기둥 도형의 z 축 방향 설정, camera, light 설정. 
drawing center circle

Step2
객체 배열을 생성하고 drawRod()에서 rod 객체 하나로 rod의 모든 정보를 사용하게 만들게 하는 코드 구조 수정 

Step3 
기존에 분리되어있었던 rod, handle, foosmen 생성 함수를 drawRodGroup() 을 통해 그룹으로 적용하여 생성하도록 코드 update

Step4
handle Select하는 Logic에 Keypressed() 함수 수정 - p1RodIndexes 를 벗어나는 입력 범위 안정적으로 처리 위한 코드 수정.(using max, min)
- 다른  rod 선택 시, 이전 Rod offsetY 위치 0으로 되돌리기.

Step5
foosmen이 field 벽에 닿는 범위를 넘지 않도록 제한하기 위해 constrain() 함수 생성.


Timer 표기시 
goal 화면 연출 제외하고 gamestate = playing 일떄만 timer 작동 하도록 수정. 

UI 관련 기능들 
파일 분리.


