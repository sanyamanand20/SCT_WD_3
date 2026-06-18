const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Player 'X' tum ho, 'O' Computer hai
let isGameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Agar cell bhara hai, game khatam hai, ya computer ki turn chal rahi hai toh click rok do
    if (boardState[clickedCellIndex] !== "" || !isGameActive || currentPlayer === "O") {
        return;
    }

    // Player X ka move
    updateCell(clickedCell, clickedCellIndex);
    
    // Check karo Player X jeeta ya draw hua
    const gameOver = checkForWinner();

    // Agar game bacha hai, toh 500ms ke delay ke baad computer chalega (taki real lage)
    if (!gameOver && isGameActive) {
        statusElement.textContent = "Computer is thinking...";
        setTimeout(computerMove, 500);
    }
}

function updateCell(cell, index) {
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
}

// Computer ki turn ka logic
function computerMove() {
    if (!isGameActive) return;

    // Sabhi khaali (empty) cells ki index nikal lo
    let emptyCells = [];
    boardState.forEach((val, index) => {
        if (val === "") emptyCells.push(index);
    });

    // Agar koi khaali jagah bachi hai, toh random ek select karo
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const targetCell = document.querySelector(`[data-index="${randomIndex}"]`);

        // Computer (O) ka move chalao
        updateCell(targetCell, randomIndex);
        checkForWinner();
    }
}

function checkForWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;
        
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        if (currentPlayer === "X") {
            statusElement.textContent = `You Win! 🎉`;
            statusElement.style.color = '#00adb5';
        } else {
            statusElement.textContent = `Computer Wins! 🤖`;
            statusElement.style.color = '#ff5722';
        }
        isGameActive = false;
        return true; // Game over
    }

    let roundDraw = !boardState.includes("");
    if (roundDraw) {
        statusElement.textContent = "It's a Draw! 🤝";
        statusElement.style.color = "#eee";
        isGameActive = false;
        return true; // Game over
    }

    // Turn badlo
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent = currentPlayer === "X" ? "Your Turn (X)" : "Computer's Turn (O)";
    return false; // Game chal raha hai
}

function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    statusElement.textContent = "Your Turn (X)";
    statusElement.style.color = "#00adb5";
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('X', 'O');
    });
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);