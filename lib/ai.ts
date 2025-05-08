import { Chess, Square } from 'chess.js';

// Piece values
const pieceValues = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900, // King value is arbitrary high for checkmate detection
};

// Piece-Square Tables (example values, can be refined)
// Values are for White pieces. For Black, the table is mirrored vertically and values are negated.
const pawnTable = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const knightTable = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50]
];

const bishopTable = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20]
];

const rookTable = [
  [0, 0, 0, 5, 5, 0, 0, 0],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const queenTable = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20]
];

const kingTable = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20]
];

// Evaluation function using material and piece-square tables
function evaluateBoard(game: Chess): number {
  let evaluation = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const position = piece.color === 'w' ? i * 8 + j : (7 - i) * 8 + j; // Flip board for black
        let pieceValue = pieceValues[piece.type];
        let positionValue = 0;

        switch (piece.type) {
          case 'p': positionValue = pawnTable[i][j]; break;
          case 'n': positionValue = knightTable[i][j]; break;
          case 'b': positionValue = bishopTable[i][j]; break;
          case 'r': positionValue = rookTable[i][j]; break;
          case 'q': positionValue = queenTable[i][j]; break;
          case 'k': positionValue = kingTable[i][j]; break;
        }

        // Adjust value based on color and position
        evaluation += piece.color === 'w' ? (pieceValue + positionValue) : -(pieceValue + positionValue);
      }
    }
  }

  return evaluation;
}

// Minimax algorithm with Alpha-Beta Pruning
function minimax(game: Chess, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const possibleMoves = game.moves();

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of possibleMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo(); // Undo the move
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Beta cut-off
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of possibleMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo(); // Undo the move
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Alpha cut-off
      }
    }
    return minEval;
  }
}

// Find the best move using Minimax with Alpha-Beta Pruning
export function findBestMove(game: Chess, depth: number): string | null {
  const possibleMoves = game.moves();
  let bestMove = null;
  let bestValue = game.turn() === 'w' ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  for (const move of possibleMoves) {
    game.move(move);
    const boardValue = minimax(game, depth - 1, alpha, beta, game.turn() === 'b'); // Switch player for the next turn
    game.undo();

    if (game.turn() === 'w') { // Maximizing player (White)
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestValue);
    } else { // Minimizing player (Black)
      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
      beta = Math.min(beta, bestValue);
    }
  }

  return bestMove;
}
