export const GAME_STATUS = Object.freeze({
    READY: "ready",
    RUNNING: "running",
    PAUSED: "paused",
    GAME_OVER: "gameover",
});

export const DIRECTIONS = Object.freeze({
    up: Object.freeze({ x: 0, y: -1 }),
    right: Object.freeze({ x: 1, y: 0 }),
    down: Object.freeze({ x: 0, y: 1 }),
    left: Object.freeze({ x: -1, y: 0 }),
});

const OPPOSITE_DIRECTIONS = Object.freeze({
    up: "down",
    right: "left",
    down: "up",
    left: "right",
});

export function createGameState(config = {}, random = Math.random) {
    const width = Number.isInteger(config.width) ? config.width : 16;
    const height = Number.isInteger(config.height) ? config.height : 16;
    const initialDirection = isDirection(config.initialDirection) ? config.initialDirection : "right";
    const snake = cloneSnake(
        Array.isArray(config.initialSnake) && config.initialSnake.length > 0
            ? config.initialSnake
            : buildInitialSnake(width, height),
    );
    const food = placeFood(width, height, snake, random);

    return {
        width,
        height,
        snake,
        direction: initialDirection,
        queuedDirection: initialDirection,
        food,
        score: 0,
        status: GAME_STATUS.READY,
        gameOverReason: null,
    };
}

export function resetGame(config = {}, random = Math.random) {
    return createGameState(config, random);
}

export function startGame(state) {
    if (state.status !== GAME_STATUS.READY) {
        return state;
    }

    return {
        ...state,
        status: GAME_STATUS.RUNNING,
    };
}

export function togglePause(state) {
    if (state.status === GAME_STATUS.RUNNING) {
        return {
            ...state,
            status: GAME_STATUS.PAUSED,
        };
    }

    if (state.status === GAME_STATUS.PAUSED) {
        return {
            ...state,
            status: GAME_STATUS.RUNNING,
        };
    }

    return state;
}

export function queueDirection(state, nextDirection) {
    if (!isDirection(nextDirection)) {
        return state;
    }

    if (state.snake.length > 1 && OPPOSITE_DIRECTIONS[state.direction] === nextDirection) {
        return state;
    }

    return {
        ...state,
        queuedDirection: nextDirection,
    };
}

export function stepGame(state, random = Math.random) {
    if (state.status !== GAME_STATUS.RUNNING) {
        return state;
    }

    const nextDirection = state.queuedDirection;
    const nextHead = getNextHead(state.snake[0], nextDirection);
    const isEating = positionsMatch(nextHead, state.food);
    const collisionBody = isEating ? state.snake : state.snake.slice(0, -1);

    if (isOutsideBoard(nextHead, state.width, state.height)) {
        return endGame(state, nextDirection, "wall");
    }

    if (collisionBody.some((segment) => positionsMatch(segment, nextHead))) {
        return endGame(state, nextDirection, "self");
    }

    const nextSnake = [nextHead, ...cloneSnake(state.snake)];

    if (!isEating) {
        nextSnake.pop();
    }

    const nextFood = isEating ? placeFood(state.width, state.height, nextSnake, random) : state.food;
    const isBoardFilled = isEating && nextFood === null;

    return {
        ...state,
        snake: nextSnake,
        direction: nextDirection,
        queuedDirection: nextDirection,
        food: nextFood,
        score: state.score + (isEating ? 1 : 0),
        status: isBoardFilled ? GAME_STATUS.GAME_OVER : GAME_STATUS.RUNNING,
        gameOverReason: isBoardFilled ? "filled" : null,
    };
}

export function placeFood(width, height, snake, random = Math.random) {
    const occupied = new Set(snake.map((segment) => toKey(segment)));
    const availableCells = [];

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const key = toKey({ x, y });
            if (!occupied.has(key)) {
                availableCells.push({ x, y });
            }
        }
    }

    if (availableCells.length === 0) {
        return null;
    }

    const randomValue = typeof random === "function" ? random() : Math.random();
    const safeValue = Number.isFinite(randomValue) ? Math.max(0, Math.min(0.999999, randomValue)) : 0;
    const index = Math.floor(safeValue * availableCells.length);
    const chosenCell = availableCells[index];

    return { x: chosenCell.x, y: chosenCell.y };
}

function buildInitialSnake(width, height) {
    const headX = Math.max(2, Math.floor(width / 2));
    const headY = Math.floor(height / 2);

    return [
        { x: headX, y: headY },
        { x: headX - 1, y: headY },
        { x: headX - 2, y: headY },
    ];
}

function getNextHead(head, direction) {
    const delta = DIRECTIONS[direction];

    return {
        x: head.x + delta.x,
        y: head.y + delta.y,
    };
}

function endGame(state, direction, reason) {
    return {
        ...state,
        direction,
        queuedDirection: direction,
        status: GAME_STATUS.GAME_OVER,
        gameOverReason: reason,
    };
}

function positionsMatch(first, second) {
    return Boolean(first) && Boolean(second) && first.x === second.x && first.y === second.y;
}

function isOutsideBoard(position, width, height) {
    return position.x < 0 || position.y < 0 || position.x >= width || position.y >= height;
}

function cloneSnake(snake) {
    return snake.map((segment) => ({ x: segment.x, y: segment.y }));
}

function toKey(position) {
    return `${position.x},${position.y}`;
}

function isDirection(value) {
    return Object.prototype.hasOwnProperty.call(DIRECTIONS, value);
}
