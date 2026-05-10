# Project 1

- **Name**: Jisu Park  
- **Student ID**: 20265185  
- **Repository URL**: https://github.com/isupark/20265185_Project1.git  
- **YouTube Link**:  

---

# 1. Description of the Game

This project is a digital table soccer game inspired by the classic *Table Kicker* (foosball) game.

The player selects rods, moves them vertically, and rotates them to kick the ball using the foosmen attached to each rod. The objective is to score more goals than the opponent within the limited game time.

The game was implemented using **p5.js WEBGL**, allowing the traditional 2D table soccer game to be extended into a 3D interactive environment.

Key implementation features include:

- WEBGL-based 3D stadium rendering  
- Object-oriented rod and foosman management  
- Physics-based ball movement and collision handling  
- Kick mechanics with multiple power levels  
- Real-time UI overlay system  
- Opponent player movement and kick logic  
- Input visualization overlay for user interaction feedback  

---

# 2. Description of the Code

## 2.1 Component Drawing

### Step 1 | 2D Field → WEBGL-based 3D Field

The initial 2D field structure (`sketch.js`) was expanded into a 3D stadium using the WEBGL mode of p5.js.

- Implemented the field, walls, center line, and goal boxes as 3D objects  
- Positioned rods and foosmen using a 3D coordinate system  

---

### Step 2 | Object-Based Rod and Foosman Structure

Initially, rod counts, team information, and position values were managed separately.

Later, the structure was redesigned using an array of rod objects so that each rod could manage all related states internally.

Each rod object contains the following information:

```js
{ count: 4, team: "p2", x: 0, offsetY: 0, angle: 0 }
```

| Key | Description |
| :--- | :--- |
| **count** | Number of foosmen |
| **team** | Player team |
| **x** | X-axis position of the rod |
| **offsetY** | Vertical movement offset |
| **angle** | Rotation angle of the rod |

This structure allowed rod movement, rotation, and collision calculations to be handled within a unified system.

---

### Step 3 | Rod Group Rendering Structure

`drawAllRods()` was designed to pass each rod object into `drawRodGroup()`.

Inside `drawRodGroup()`, `push()` and `pop()` were used to render:

- rod  
- handle  
- foosmen  

as a single grouped structure.

---

### Step 4 | Rod Selection System

- Player 1 can switch between three rods using the left and right arrow keys  
- The selected rod is identified using the `isSelected` value  
- The selected handle is visually highlighted through color changes  

---

### Step 5 | Vertical Rod Movement

The selected rod moves vertically by updating its `offsetY` value while the up/down arrow keys are pressed.

Additionally:

- `constrain()` was used to prevent foosmen from moving outside the field boundaries  
- When another rod is selected, the previous rod automatically returns to its default position (`offsetY = 0`)  

---

# 2.2 Mechanics

### Step 1 | Ball Object and Collision Handling

`drawBall()` renders the ball as a sphere within the WEBGL environment.

- `updateBall()` updates the ball position based on velocity  
-  Ball velocity is reversed and constrained when colliding with walls
- Friction gradually slows down the ball  
- Ball collision with foosmen includes velocity reflection and overlap correction  
- `getServerRod()` and `resetBallServer()` initialize the ball at the correct serve position after each goal  

---

### Step 2 | Foosman Position Calculation System

`getFoosmanPositionsOnRod()` was implemented to calculate the actual world position of each foosman based on rod states.

This position system was later used for:

- ball collision handling  
- kick detection  
- opponent player logic  

---

### Step 3 | Kick Detection and Rod Rotation

`getNearestFoosmanToBall()` finds the foosman closest to the ball.

- If the distance is within `KICK_RANGE`, the ball becomes kickable  
- Kick strength controls both rod rotation angle and ball speed based on Spacebar press duration  
- `rotateSelectedRod()` handles the rod rotation animation  

---

### Step 4 | Ball Kick Direction and Velocity

The ball velocity changes when a successful kick occurs.

- Player 1 kicks toward the right direction  
- Player 2 kicks toward the left direction  
- The difference between the ball position and foosman center position on the y-axis determines whether the kick becomes straight or diagonal  

---

### Step 5 | Goal Detection

- Wall collision is disabled inside the goal opening area  
- A goal is detected when the ball enters the goal box range  
- After a goal, the score increases and the serve position resets  

---

# 2.3 UI

### Step 1 | Score and Timer UI

The score, timer, and game state texts are rendered using 2D screen coordinates independent from the 3D field.

- `image(uiLayer, 0, 0)` overlays the UI on top of the WEBGL scene  
- `scoreP1` and `scoreP2` are updated in real time  
- Remaining game time is calculated using `gameStartTime` and `millis()`  
- During goal animations, `pausedTime` accumulates so the timer does not decrease  

---

### Step 2 | Game State-Based UI Flow

The `gameState` value manages transitions between:

- `start`  
- `playing`  
- `goal`  
- `gameover`  

states.

- The start state displays “Press Enter to Start”  
- The playing state continuously updates score and timer UI  
- The goal state displays a goal animation overlay  
- The gameover state shows the final result screen  

---

### Step 3 | Input Visualization Overlay

An `inputState` object was created to store:

- left  
- right  
- up  
- down  
- kick  

input states.

- LEFT/RIGHT inputs are updated using `keyPressed()` and `keyReleased()`  
- UP/DOWN movement uses continuous input handling through `keyIsDown()`  
- SPACE input uses `spacePressedTime` to visualize charging states  

---

# 3. Issues

### 1. Ball Stopping in Unreachable Areas

Sometimes the ball stopped in positions unreachable by both players.

**Solution:**  
Instead of allowing the ball to completely stop, a very small velocity was continuously maintained through the friction system.

---

### 2. Separating WEBGL Rendering and UI Layer (AI-assisted)

**Solution:**

- A separate UI graphics layer (`uiLayer`) was created using `createGraphics()`  
- Instead of drawing UI directly inside the WEBGL canvas, the UI was rendered on a dedicated 2D overlay canvas  
- The UI layer position was synchronized every frame using `mainCanvas.getBoundingClientRect()`  

---

### 3. Ball Getting Stuck Inside Foosmen

The ball occasionally became trapped when its position exactly overlapped with a foosman.

**Solution:**  
The ball velocity was reversed and the ball position was pushed outward from the foosman to prevent overlapping.

---

### 4. Opponent Player Kicking Too Frequently

The opponent player performed kicks every frame, resulting in unrealistic gameplay.

**Solution:**  
A cooldown system was added so the opponent can only kick again after a certain amount of time has passed since the previous kick.

---

# 4. Acknowledgement of Help

## AI-Assisted Components

### Component Drawing

- WEBGL cylinder orientation, camera setup, and lighting configuration  
- Drawing the center circle  
- Refactoring rod information into object arrays  
- Updating the rendering structure so rods, handles, and foosmen are grouped inside `drawRodGroup()`  
- Improving rod selection logic using `max()` and `min()` inside `keyPressed()`  
- Resetting previous rod positions when switching rods  
- Using `constrain()` to prevent foosmen from leaving the field boundary  

---

### Mechanics

- Ball collision direction and velocity calculations  
- Kick strength-based conversion system for rod rotation  angle and ball velocity
- Goal serve management and ball reset logic  
- Foosman position calculation system  
- Opponent player movement and kick logic  
- Preventing timer reduction during goal animations using `pausedTime`  

---

### UI

- Creating a separate UI graphics layer (`uiLayer`) for WEBGL rendering  
- Updating the timer logic so it only runs during the `playing` state  
- Separating UI-related functions into dedicated files  
- Creating the `renderGameUI()` function  
- Designing and positioning the input key panel overlay  


## Future Improvements

- **MPU6050 Controller Input**  
  Future versions of the game could connect a physical controller using an MPU6050 motion sensor.  
  Instead of keyboard input, rod kick motion could be controlled through real-world rotational movement for a more immersive gameplay experience.

- **Animation Polish**  
  Additional animation details could be added to improve visual quality and game feedback.  
  Examples include smoother rod rotation, ball impact effects, goal animations, camera motion, and lighting transitions.

