const io = require('socket.io-client');
const serverUrl = "http://192.168.1.134:4000";
const socket = io(serverUrl);

const USER_NAME = "Mariana";
const TOURNAMENT_ID = 142857;
const USER_ROLE = 'player';
const COLUMN_COUNT = 7;
const ROW_COUNT = 6;

socket.on('connect', () => {
  console.log("Connected to server")

  socket.emit('signin', {
    user_name: USER_NAME,
    tournament_id: TOURNAMENT_ID,
    user_role: USER_ROLE
  })
});

socket.on('ok_signin', () => {
  console.log("Login")
});

socket.on('ready', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var board = data.board;
  
  // TODO: Implement your AI logic here
  var movement = calculateBestMove(board, playerTurnID);
  
  socket.emit('play', {
    tournament_id: TOURNAMENT_ID,
    player_turn_id: playerTurnID,
    game_id: gameID,
    board: board,
    movement: movement
  });
});

socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;

  socket.emit("player_ready",{
    tournament_id: TOURNAMENT_ID,
    player_turn_id: playerTurnID,
    game_id: gameID
  });
});

function calculateBestMove(board, playerTurnID) {
  // Implement your heuristics and move calculation logic here
  var possibleMoves = getPossibleMoves(board);
  var bestMove = possibleMoves[0];
  var maxScore = -Infinity;

  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    var score = evaluateMove(board, move, playerTurnID);
    
    if (score > maxScore) {
      maxScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

function getPossibleMoves(board) {
  var moves = [];
  
  for (var column = 0; column < COLUMN_COUNT; column++) {
    if (isColumnPlayable(board, column)) {
      moves.push(column + 1);
    }
  }
  
  return moves;
}

function isColumnPlayable(board, column) {
  return board[0][column] === 0;
}

function evaluateMove(board, move, playerTurnID) {
  var clonedBoard = cloneBoard(board);
  makeMove(clonedBoard, move, playerTurnID);
  
  // Apply heuristics and assign a score to the move
  var heuristic1Score = heuristic1(clonedBoard, playerTurnID);
  var heuristic2Score = heuristic2(clonedBoard, playerTurnID);
  
  // Return the combined score based on the weight of each heuristic
  return 0.6 * heuristic1Score + 0.4 * heuristic2Score;
}

function cloneBoard(board) {
  var clonedBoard = [];
  
  for (var row = 0; row < ROW_COUNT; row++) {
    clonedBoard[row] = board[row].slice();
  }
  
  return clonedBoard;
}

function makeMove(board, move, playerTurnID) {
  for (var row = ROW_COUNT - 1; row >= 0; row--) {
    if (board[row][move - 1] === 0) {
      board[row][move - 1] = playerTurnID;
      break;
    }
  }
}

function heuristic1(board, playerTurnID) {
  // Implement your first heuristic logic here
  // Return a score that represents the quality of the board for the player
  return Math.random(); // Placeholder random score
}

function heuristic2(board, playerTurnID) {
  // Implement your second heuristic logic here
  // Return a score that represents the quality of the board for the player
  return Math.random(); // Placeholder random score
}
