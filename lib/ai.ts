import { Chess, Square } from 'chess.js';

// Basic evaluation function (material count)
// Positive values favor White, negative values favor Black
function evaluateBoard(game: Chess): number {
  let evaluation = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = getPieceValue(piece.type, piece.color);
        evaluation += value;
      }
    }
  }

  return evaluation;
}

// Assign values to pieces
function getPieceValue(type: string, color: 'w' | 'b'): number {
  let value = 0;
  switch (type) {
    case 'p': value = 10; break; // Pawn
    case 'n': value = 30; break; // Knight
    case 'b': value = 30; break; // Bishop
    case 'r': value = 50; break; // Rook
    case 'q': value = 90; break; // Queen
    case 'k': value = 900; break; // King (arbitrary high value)
    default: value = 0;
  }

  // Adjust value based on color
  return color === 'w' ? value : -value;
}

// Simple Minimax algorithm (without alpha-beta pruning for now)
function minimax(game: Chess, depth: number, maximizingPlayer: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const possibleMoves = game.moves();

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of possibleMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, false);
      game.undo(); // Undo the move
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of possibleMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, true);
      game.undo(); // Undo the move
      minEval = Math.min(minEval, evaluation);
    }
    return minEval;
  }
}

// Find the best move using Minimax
export function findBestMove(game: Chess, depth: number): string | null {
  const possibleMoves = game.moves();
  let bestMove = null;
  let bestValue = game.turn() === 'w' ? -Infinity : Infinity;

  for (const move of possibleMoves) {
    game.move(move);
    const boardValue = minimax(game, depth - 1, game.turn() === 'b'); // Switch player for the next turn
    game.undo();

    if (game.turn() === 'w') { // Maximizing player (White)
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    } else { // Minimizing player (Black)
      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }
  }

  return bestMove;
}
