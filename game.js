const startScreen = document.querySelector(".start-screen");
const gameArea = document.querySelector(".game-area");
const startBtn = document.getElementById("startBtn");

const scoreEl = document.querySelector(".score");
const levelEl = document.querySelector(".level");
const speedEl = document.querySelector(".speed");

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

let player = {
    speed: 5,
    score: 0,
    level: 1,
    start: false
};



startBtn.addEventListener("click", startGame);

function startGame(){
    startScreen.style.display = "none";

    gameArea.innerHTML = `
        <div class="road-line"></div>
        <div class="road-line"></div>
        <div class="road-line"></div>
        <div class="road-line"></div>
        <div class="car player-car"></div>
    `;

    player.start = true;
    player.score = 0;
    player.level = 1;
    player.speed = 5;

    createEnemies();
    window.requestAnimationFrame(gameLoop);
}



document.addEventListener("keydown", (e)=>{
    if(keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

document.addEventListener("keyup", (e)=>{
    if(keys.hasOwnProperty(e.key)) keys[e.key] = false;
});



function gameLoop(){
    if(player.start){
        moveRoad();
        movePlayer();
        moveEnemies();

        // Score
        player.score++;

        // Level & speed system
        if(player.score % 500 === 0){
            player.level++;
            player.speed++;
        }

        // UI update
        scoreEl.innerText = "Score : " + player.score;
        levelEl.innerText = "Level : " + player.level;
        speedEl.innerText = "Speed : " + player.speed;

        window.requestAnimationFrame(gameLoop);
    }
}


function moveRoad(){
    const lines = document.querySelectorAll(".road-line");
    lines.forEach(line=>{
        let top = line.offsetTop + player.speed;
        if(top >= 600) top = -100;
        line.style.top = top + "px";
    });
}



function movePlayer(){
    const car = document.querySelector(".player-car");
    let left = car.offsetLeft;
    let top = car.offsetTop;

    if(keys.ArrowLeft && left > 0){
        car.style.left = (left - player.speed) + "px";
    }
    if(keys.ArrowRight && left < 350){
        car.style.left = (left + player.speed) + "px";
    }
    if(keys.ArrowUp && top > 0){
        car.style.top = (top - player.speed) + "px";
    }
    if(keys.ArrowDown && top < 510){
        car.style.top = (top + player.speed) + "px";
    }
}



function createEnemies(){
    for(let i=0;i<3;i++){
        let enemy = document.createElement("div");
        enemy.classList.add("car","enemy-car");
        enemy.style.top = (-300 * (i+1)) + "px";
        enemy.style.left = Math.floor(Math.random()*350) + "px";
        enemy.y = -300 * (i+1);
        gameArea.appendChild(enemy);
    }
}

function moveEnemies(){
    const enemies = document.querySelectorAll(".enemy-car");
    const playerCar = document.querySelector(".player-car");

    enemies.forEach(enemy=>{
        // Collision check
        if(isCollide(playerCar, enemy)){
            gameOver();
        }

        enemy.y += player.speed + player.level;

        if(enemy.y > 600){
            enemy.y = -300;
            enemy.style.left = Math.floor(Math.random()*350) + "px";
        }

        enemy.style.top = enemy.y + "px";
    });
}


function isCollide(a,b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}



function gameOver(){
    player.start = false;

    startScreen.style.display = "flex";
    startScreen.innerHTML = `
        <h1>GAME OVER</h1>
        <p>Score : ${player.score}</p>
        <p>Level : ${player.level}</p>
        <button id="restartBtn">RESTART</button>
    `;

    document.getElementById("restartBtn").addEventListener("click", ()=>{
        location.reload();
    });
}
