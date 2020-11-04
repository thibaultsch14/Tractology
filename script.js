// SCROLL ANIMATIONS

// define all variables to be animated
let cards = document.querySelectorAll('.card');
let pictures = document.querySelectorAll('.picture');
let names = document.querySelectorAll('.name');
let positions = document.querySelectorAll('.position');

// loop through the profile cards
for (let i = 0; i < cards.length; i++) {
    
    // define a timeline for the animations
    let timeline = gsap.timeline({
        scrollTrigger: {
            trigger: cards[i],  
            toggleActions: "play reset complete reset",
        }
    });

    // animate the pictures
    timeline.from(pictures[i], {
        opacity: 0,
        y: 200,
        duration: 0.5,
    }, "+=0.2");

    // animate the names
    timeline.from(names[i], {
        opacity: 0,
        y: 50,
        duration: 0.5,
    },"-=0.5");

    // animate the positions
    timeline.from(positions[i], {
        opacity: 0,
        y: 50,
        duration: 0.5,
    },"-=0.2");

}


// TABS

// define variables
let tabs = document.querySelectorAll(".tab");
let display = document.querySelectorAll(".display");

// make all tabs clickable
for (i = 0 ; i < tabs.length ; i++) {
    tabs[i].addEventListener('click', onButtonClick);
}

//Define what happens if the onButtonClick function is called
function onButtonClick (event) {
    event.preventDefault(); //precautionary measure
    currentTab = event.currentTarget; //define current tab

    //Define active and inactive tabs and corresponding display pages
    for (i = 0 ; i < tabs.length ; i++) {
        if (tabs[i].getAttribute('id') === currentTab.getAttribute('id')) {
            tabs[i].classList.add('active');
            display[i].classList.add('active');
        } else {
            tabs[i].classList.remove('active');
            display[i].classList.remove('active');
        }
    }
}


// GAME

// define canvas and context

let cvs = document.getElementById("canvas");

let ctx = cvs.getContext("2d");


// load image variables and sources

let bird = new Image();

let bg = new Image();

let fg = new Image();

let pipeNorth = new Image();

let pipeSouth = new Image();

let gameOver = new Image();

let gray = new Image();

let start = new Image();

bird.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2FtractorXS.png?v=1604160318391';

bg.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Fsky.jpg?v=1604158107316';

fg.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2FgrassXS.png?v=1604158544931';

pipeNorth.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Fapplepile2.png?v=1604257304763';

pipeSouth.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Fapplepile2.png?v=1604257304763';

gameOver.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Fgameover.jpg?v=1604158984112';

gray.src='https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Fgray.png?v=1604243825880';

start.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Fpress%2Bstart%2Bretro%2Bgaming.gif?v=1604163099112';

start.onload = drawStart; // only draw this image once it has loaded to avoid loading on an empty canvas


// some game variables

let gap = 120;

let constant;

let bX = 10;

let bY = 150;

let gravity = 1.5;

let score = 0;

let endOfGame = undefined;


// audio variables and sources

let fly = new Audio();

let scor = new Audio();

let gameOverAudio = new Audio();

let startAudio = new Audio();

let music = new Audio();

let success = new Audio();

fly.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Ffly.wav?v=1604165277669';

scor.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Fscore.wav?v=1604165289817';

gameOverAudio.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Fgameover.wav?v=1604165289238';

startAudio.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2FstartGame.wav?v=1604239669072';

music.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2Fmusic_1.wav?v=1604239928462';

success.src = 'https://cdn.glitch.com/d8f2aecd-7b59-4de6-b2b0-d62073e247bf%2FSuccess.wav?v=1604244774679';


// block controls outside of game and define click to start

document.removeEventListener("keydown",moveUp);
cvs.removeEventListener("click",moveUp);
cvs.addEventListener("click",startGame);

// function that draws the starting image and fires off once the image has loaded

function drawStart() {
    ctx.drawImage(start,20,0);
}

// function that handles the bounce of the tractor and fires off when user presses a key or clicks

function moveUp(){
    bY -= 20;
    fly.play();
}

// function that handles the start of the game and fires off on click

function startGame() {
    startAudio.play();
    cvs.removeEventListener("click",startGame); // this is essential as otherwise the game becomes unplayable when the user clicks the canvas
    setTimeout(draw,1000); // launch the game!
}

// pipe coordinates

let pipe = [];
pipe[0] = {
    x : cvs.width,
    y : 0
};

// main function that draws the game and defines its rules. It fires off after a 1s delay after the user clicks. It is called by startGame().

function draw() {

    // play music
    music.play(); music.loop=true;

    // allow controls
    document.addEventListener("keydown",moveUp);
    cvs.addEventListener("click",moveUp);
    onkeydown = function(e) { 
        return !(e.keyCode == 32);
    }; // this prevents the space bar from scrolling when playing the game

    // draw background
    ctx.drawImage(bg,0,0);

    // for loop going through the array of obstacles
    for(let i = 0; i < pipe.length; i++){

        constant = pipeNorth.height+gap;
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);
        pipe[i].x--; // make the obstacle move left

        // add a new obstacle when the current one enters within 200px of the canvas' left edge. New obstacle will have random viable y component
        if( pipe[i].x == 200 ){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
            });
        }

        // detect collision
        if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  cvs.height - fg.height) {

            endOfGame = true;

        }
        
        // detect score+1
        if(pipe[i].x == 5){
            score++;
            let number = score/5;

            if (Number.isInteger(number)) {
                success.play();
            } else {
                scor.play();
            }

            if (endOfGame === true) {
                score--;
            }
        }
    }
    
    // define all parameters when the game is over
    if (endOfGame === true) {
        onkeydown = function(e) { 
            if (e.keycode == 32){
                return (e.keyCode == 32);
            }
        }; // allow space bar scroll again
        document.removeEventListener("keydown",moveUp); 
        cvs.removeEventListener("click",moveUp);
        cvs.style.cursor = 'auto';
        gameOverAudio.play(); 
        ctx.drawImage(gameOver,0,0);
        ctx.drawImage(gray,0,cvs.height-50);
        ctx.fillStyle = "#000";
        ctx.font = "20px PressStart";
        ctx.fillText("Score : "+score,10,cvs.height-13);
        music.pause(); music.loop=false; music.currentTime=0;
        return;
    }
    
    // define gravity
    bY += gravity;

    // draw the foreground, the tractor and the scoreboard
    ctx.drawImage(fg,0,cvs.height - fg.height);
    ctx.drawImage(bird,bX,bY);
    ctx.drawImage(gray,0,cvs.height-50);
    ctx.fillStyle = "#000";
    ctx.font = "20px PressStart";
    ctx.fillText("Score : "+score,10,cvs.height-13);
    requestAnimationFrame(draw);
}
