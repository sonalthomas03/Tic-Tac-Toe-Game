const tiles = document.querySelectorAll(".tile"); //to obtain all the divs with class "tile"
const PLAYER_X = "X"; //constants that dont change
const PLAYER_O = "O";
let turn = PLAYER_X;//let keyword means that it is a variable that can change

const boardState = Array(tiles.length); //this is used to track the current state of the board
                                       //ie, which player has placed Xs and Os in which tile.
                                       //this will have 9 items since the tiles variable
                                       //has length of 9
boardState.fill(null); //array values are intialized to null

//Elements, this is done to access these items via their id
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
playAgain.addEventListener("click",startNewGame);


//sounds
const gameOverSound = new Audio('sounds/game_over.wav'); // importing sound files from sounds folder
const clickSound = new Audio('sounds/click.wav');

//traversing through each tile and adding event listener
tiles.forEach(tile=>tile.addEventListener('click',tileClick));


function setHoverText(){
    //remove all hover text
    tiles.forEach(tile=>{
        tile.classList.remove("x-hover");
        tile.classList.remove("o-hover");
    });

    const hoverClass = `${turn.toLowerCase()}-hover`;

    tiles.forEach(tile=>{
        if(tile.innerText == ""){
            tile.classList.add(hoverClass);
        }
    })
}

setHoverText();

function tileClick(event){
    if(gameOverArea.classList.contains('visible')){
        return;
    }

    const tile = event.target;
    const tileNumber = tile.dataset.index;
    if(tile.innerText != ""){
        return;
    }

    if(turn === PLAYER_X){
        tile.innerText = PLAYER_X;
        boardState[tileNumber-1] = PLAYER_X;
        console.log("working");

        turn = PLAYER_O;
    }
    else{
        tile.innerText = PLAYER_O;
        boardState[tileNumber-1] = PLAYER_O;
        turn = PLAYER_X;      
    }
    clickSound.play();
    setHoverText();

    checkWinner();

}


function checkWinner(){
    for(const winningCombination of winningCombinations){
        //object destructuring
        const {combo,strikeClass} = winningCombination;

        const tilevalue1 = boardState[combo[0]-1];
        const tilevalue2 = boardState[combo[1]-1];
        const tilevalue3 = boardState[combo[2]-1];

        if(tilevalue1!=null && tilevalue1 == tilevalue2 && tilevalue1 == tilevalue3){
            strike.classList.add(strikeClass);
            gameOverScreen(tilevalue1);
            return;
        }
    }
    //Check for Draw
    let flag = 1;
    for(const tile of boardState){
        if(tile==null){
            flag*=0;
        }
    }
    if(flag==1){
        gameOverScreen(null);
    }

}

function gameOverScreen(winnerText){
    let text = 'Draw!';
    if(winnerText != null){
        text = `Winner is ${winnerText}!`;
    }

    gameOverArea.className = 'visible';
    gameOverText.innerText = text;
    gameOverSound.play();
}


const winningCombinations = [
    //rows
    { combo:[1,2,3], strikeClass: "strike-row-1"},
    { combo:[4,5,6], strikeClass: "strike-row-2"},
    { combo:[7,8,9], strikeClass: "strike-row-3"},
    //columns
    { combo:[1,4,7], strikeClass: "strike-column-1"},
    { combo:[2,5,8], strikeClass: "strike-column-2"},
    { combo:[3,6,9], strikeClass: "strike-column-3"},
    //diagonals
    { combo:[1,5,9], strikeClass: "strike-diagonal-1"},
    { combo:[3,5,7], strikeClass: "strike-diagonal-2"}
];

function startNewGame(){
    strike.className = "strike";
    gameOverArea.className = "hidden";
    boardState.fill(null);
    tiles.forEach(tile=>(tile.innerText = ""));
    turn = PLAYER_X;
    setHoverText();
}

