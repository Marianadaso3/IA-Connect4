const COLS = 7;
const ROWS = 6;

function minimax(board, depth, isMaximizing, playerId) {
    const result = checkWinner(board);
    if (result !== null || depth === 0) {
        return result;
    }

    const maximizingPlayer = isMaximizing ? playerId : (playerId === 1 ? 2 : 1);
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let move;

    for (let col = 0; col < COLS; col++) {
        const row = getLowestEmptyRow(board, col);
        if (row !== null) {
            board[row][col] = maximizingPlayer;
            const score = minimax(board, depth - 1, !isMaximizing, playerId);
            board[row][col] = 0;

            if ((isMaximizing && score > bestScore) || (!isMaximizing && score < bestScore)) {
                bestScore = score;
                move = col;
            }
        }
    }

    return isMaximizing ? bestScore : move;
}

function getLowestEmptyRow(board, col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            return row;
        }
    }
    return null;
}

function checkWinner(board) {
    const directions = [
        { dx: 0, dy: 1 }, // vertical
        { dx: 1, dy: 0 }, // horizontal
        { dx: 1, dy: 1 }, // ascendingDiagonal
        { dx: 1, dy: -1 } // descendingDiagonal
    ];

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const currentPlayer = board[row][col];
            if (currentPlayer !== 0) {
                for (const direction of directions) {
                    const { dx, dy } = direction;
                    const endRow = row + 3 * dy;
                    const endCol = col + 3 * dx;

                    if (
                        isValidPosition(endRow, endCol) &&
                        currentPlayer === board[row + dy][col + dx] &&
                        currentPlayer === board[row + 2 * dy][col + 2 * dx] &&
                        currentPlayer === board[endRow][endCol]
                    ) {
                        return currentPlayer;
                    }
                }
            }
        }
    }

    return null;
}

function isValidPosition(row, col) {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function makeMove(board, playerId) {
    let bestScore = -Infinity;
    let move;

    for (let col = 0; col < COLS; col++) {
        const row = getLowestEmptyRow(board, col);
        if (row !== null) {
            board[row][col] = playerId;
            const score = minimax(board, 3, false, playerId);
            board[row][col] = 0;

            if (score > bestScore) {
                bestScore = score;
                move = col;
            }
        }
    }

    return move;
}

module.exports = {
    makeMove
};
