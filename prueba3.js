// Clase que se encarga de realizar los movimientos en el tablero
class Connect4Move {
  constructor() {
    this.infinito = 100000000000;
    this.board = [];
    this.move = Math.floor(Math.random() * 7);
    this.depth = 5;
  }

  // Verifica si el movimiento es válido (no se sale del tablero)
  validMove(board, move) {
    const valid_movs = [];
    for (let col = 0; col < board[0].length; col++) {
      if (board[0][col] === 0) {
        valid_movs.push(col);
      }
    }
    return valid_movs.includes(move);
  }

  // Elige el movimiento a realizar
  makeMove(board) {
    let response = false;
    while (!response) {
      const best_move = this.minMax(board, this.depth, true, -this.infinito, this.infinito, this.move);
      response = this.validMove(board, best_move);
      if (response) {
        return best_move;
      }
    }
  }

  // Optimiza el movimiento a realizar
  minMax(board, depth, maximizingPlayer, alpha, beta, move) {
    if (depth === 0) {
      return this.evaluate(board);
    }

    if (maximizingPlayer) {
      let max_eval = -this.infinito;
      let best_move = null;

      for (let move = 0; move < 7; move++) {
        if (this.validMove(board, move)) {
          const new_board = this.makeMoveInBoard(board, move, 1);
          const evaluation = this.evaluate(new_board);

          if (evaluation > max_eval) {
            max_eval = evaluation;
            best_move = move;
          }

          alpha = Math.max(alpha, evaluation);
          if (beta <= alpha) {
            break;
          }
        }
      }

      return best_move;
    } else {
      let min_eval = this.infinito;
      let best_move = null;

      for (let move = 0; move < 7; move++) {
        if (this.validMove(board, move)) {
          const new_board = this.makeMoveInBoard(board, move, 2);
          const evaluation = this.evaluate(new_board);

          if (evaluation < min_eval) {
            min_eval = evaluation;
            best_move = move;
          }

          beta = Math.min(beta, evaluation);
          if (beta <= alpha) {
            break;
          }
        }
      }

      return best_move;
    }
  }

  // Revisa la adyacencia de fichas
  getAdjacentTiles(board, row, col, player) {
    const adjacent_tiles = [];

    if (player === undefined) {
      player = this.move;
    }

    // Vertical
    if (row + 1 < 6 && board[row + 1][col] === player) {
      adjacent_tiles.push([row + 1, col]);
    }

    // Horizontal
    if (col + 1 < 7 && board[row][col + 1] === player) {
      adjacent_tiles.push([row, col + 1]);
    }

    // Diagonal (top-left to bottom-right)
    if (row + 1 < 6 && col + 1 < 7 && board[row + 1][col + 1] === player) {
      adjacent_tiles.push([row + 1, col + 1]);
    }

    // Diagonal (top-right to bottom-left)
    if (row + 1 < 6 && col - 1 >= 0 && board[row + 1][col - 1] === player) {
      adjacent_tiles.push([row + 1, col - 1]);
    }

    return adjacent_tiles;
  }

  // Aplica la heurística
  evaluate(board) {
    const heuristic_value = 3;
    const defensive_value = 1.5;
    const strategic_value = [1, 3, 5, 7, 5, 3, 1];

    let total_value = heuristic_value;

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (board[row][col] === this.move) {
          // Fichas propias adyacentes
          const adjacencies = this.getAdjacentTiles(board, row, col);
          total_value += 3 * adjacencies.length;

          // Fichas rivales para determinar el valor defensivo
          const opponent_adjacencies = this.getAdjacentTiles(board, row, col, this.getOpponentMove());
          total_value += defensive_value * opponent_adjacencies.length;

          // Valor estratégico posicional
          total_value += strategic_value[col];
        }
      }
    }

    return total_value;
  }

  // Obtiene el valor del rival para poder obtener el valor defensivo y el min
  getOpponentMove() {
    return this.move === 2 ? 1 : 2;
  }

  makeMoveInBoard(board, move, player) {
    const new_board = board.map(row => [...row]);

    for (let row = 5; row >= 0; row--) {
      if (new_board[row][move] === 0) {
        new_board[row][move] = player;
        break;
      }
    }

    return new_board;
  }
}
