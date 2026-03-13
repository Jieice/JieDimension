import {
    GAME_STATUS,
    createGameState,
    queueDirection,
    resetGame,
    startGame,
    stepGame,
    togglePause,
} from "./snake-logic.js";

const GAME_CONFIG = {
    width: 16,
    height: 16,
};

const TICK_MS = 140;
const DIRECTION_KEYS = {
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
    ArrowLeft: "left",
    w: "up",
    W: "up",
    d: "right",
    D: "right",
    s: "down",
    S: "down",
    a: "left",
    A: "left",
};

const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");
const lengthElement = document.getElementById("length");
const statusElement = document.getElementById("status");
const pauseButton = document.getElementById("pause-button");
const restartButton = document.getElementById("restart-button");
const controlButtons = Array.from(document.querySelectorAll("[data-direction]"));
const cells = [];

let state = createGameState(GAME_CONFIG);

document.body.tabIndex = 0;
buildBoard();
render();
focusGame();

window.addEventListener("keydown", handleKeydown);
pauseButton.addEventListener("click", handlePauseButton);
restartButton.addEventListener("click", handleRestartButton);
boardElement.addEventListener("pointerdown", focusGame);

controlButtons.forEach((button) => {
    button.addEventListener("click", () => {
        applyDirection(button.dataset.direction);
    });
});

window.setInterval(() => {
    const nextState = stepGame(state);
    if (nextState !== state) {
        state = nextState;
        render();
    }
}, TICK_MS);

function buildBoard() {
    boardElement.style.gridTemplateColumns = `repeat(${GAME_CONFIG.width}, minmax(0, 1fr))`;
    boardElement.replaceChildren();

    const totalCells = GAME_CONFIG.width * GAME_CONFIG.height;

    for (let index = 0; index < totalCells; index += 1) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.setAttribute("role", "gridcell");
        boardElement.appendChild(cell);
        cells.push(cell);
    }
}

function handleKeydown(event) {
    if (event.key in DIRECTION_KEYS) {
        event.preventDefault();
        applyDirection(DIRECTION_KEYS[event.key]);
        return;
    }

    if (event.key === " " || event.key === "Enter" || event.key === "p" || event.key === "P") {
        event.preventDefault();
        handlePauseButton();
        return;
    }

    if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        handleRestartButton();
    }
}

function handlePauseButton() {
    if (state.status === GAME_STATUS.GAME_OVER) {
        return;
    }

    if (state.status === GAME_STATUS.READY) {
        state = startGame(state);
    } else {
        state = togglePause(state);
    }

    render();
    focusGame();
}

function handleRestartButton() {
    state = resetGame(GAME_CONFIG);
    render();
    focusGame();
}

function applyDirection(direction) {
    if (!direction || state.status === GAME_STATUS.GAME_OVER || state.status === GAME_STATUS.PAUSED) {
        return;
    }

    state = queueDirection(state, direction);

    if (state.status === GAME_STATUS.READY) {
        state = startGame(state);
    }

    render();
    focusGame();
}

function render() {
    scoreElement.textContent = String(state.score);
    lengthElement.textContent = String(state.snake.length);
    statusElement.textContent = getStatusText(state);
    pauseButton.textContent = getPauseButtonLabel(state.status);
    pauseButton.disabled = state.status === GAME_STATUS.GAME_OVER;

    for (const cell of cells) {
        cell.className = "cell";
    }

    if (state.food) {
        cells[toIndex(state.food.x, state.food.y)].classList.add("cell-food");
    }

    state.snake.forEach((segment, index) => {
        const cell = cells[toIndex(segment.x, segment.y)];
        cell.classList.add("cell-snake");
        if (index === 0) {
            cell.classList.add("cell-head");
        }
    });
}

function getStatusText(currentState) {
    switch (currentState.status) {
        case GAME_STATUS.READY:
            return "Press an arrow key, WASD, or tap a direction to start.";
        case GAME_STATUS.RUNNING:
            return "Eat food, grow longer, and avoid the walls and your tail.";
        case GAME_STATUS.PAUSED:
            return "Paused. Press Start, Enter, or Space to resume.";
        case GAME_STATUS.GAME_OVER:
            if (currentState.gameOverReason === "filled") {
                return `Board cleared. Final score: ${currentState.score}.`;
            }

            return `Game over. Final score: ${currentState.score}. Press Restart to play again.`;
        default:
            return "";
    }
}

function getPauseButtonLabel(status) {
    if (status === GAME_STATUS.RUNNING) {
        return "Pause";
    }

    if (status === GAME_STATUS.PAUSED) {
        return "Resume";
    }

    return "Start";
}

function toIndex(x, y) {
    return y * GAME_CONFIG.width + x;
}

function focusGame() {
    document.body.focus();
}
