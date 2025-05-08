"use client";
import { useState, useEffect, useMemo } from 'react';
import { FiClock, FiUser, FiChevronDown, FiRotateCw, FiCornerUpLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NewGameModal } from '@/components/NewGameModal';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { FiClock, FiUser, FiChevronDown, FiRotateCw, FiCornerUpLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NewGameModal } from '@/components/NewGameModal';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { findBestMove } from '@/lib/ai'; // Import the new AI function
import { GameDifficulty, difficultyToDepth, GameType } from '@/lib/types'; // Import difficulty and game type

type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'threefold repetition' | 'insufficient material' | 'fifty-move rule' | 'draw' | 'resignation';

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]); // Start with empty moves
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isAITurn, setIsAITurn] = useState(false); // State to manage AI turn
  const [aiDifficulty, setAiDifficulty] = useState<GameDifficulty>(GameDifficulty.Medium); // State to store selected AI difficulty for Human vs AI
  const [gameType, setGameType] = useState<GameType>(GameType.Human_vs_AI); // State to store the current game type
  const [whiteAIDifficulty, setWhiteAIDifficulty] = useState<GameDifficulty>(GameDifficulty.Medium); // Difficulty for White AI in AI vs AI
  const [blackAIDifficulty, setBlackAIDifficulty] = useState<GameDifficulty>(GameDifficulty.Medium); // Difficulty for Black AI in AI vs AI
  const [isInvalidMove, setIsInvalidMove] = useState(false); // State to track invalid moves

  // Helper to update game state and return the result of the modification
  function safeGameMutate(modify) {
    setGame((g) => {
      const newGame = new Chess(g.fen());
      const moveResult = modify(newGame);
      return newGame; // Return the new game object for state update
    });
  }

  // Update moves history based on current game state
  const updateMovesHistory = () => {
    const history = game.history({ verbose: true });
    const formattedMoves = [];
    for (let i = 0; i < history.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = history[i];
      const blackMove = history[i + 1];

      formattedMoves.push({
        moveNumber: moveNumber,
        white: whiteMove.san,
        black: blackMove ? blackMove.san : '',
      });
    }
    setMoves(formattedMoves);
  };

  // Check for game over conditions
  const checkGameOver = () => {
    if (game.isCheckmate()) {
      setGameStatus('checkmate');
    } else if (game.isStalemate()) {
      setGameStatus('stalemate');
    } else if (game.isThreefoldRepetition()) {
      setGameStatus('threefold repetition');
    } else if (game.isInsufficientMaterial()) {
      setGameStatus('insufficient material');
    } else if (game.isFiftyMoveDraw()) {
      setGameStatus('fifty-move rule');
    } else if (game.isDraw()) {
      setGameStatus('draw');
    } else {
      setGameStatus('playing');
    }
  };

  // AI move function using the minimax algorithm
  const makeAIMove = useCallback(() => {
    // Determine which AI's turn it is and get the corresponding difficulty
    const currentAIDifficulty = game.turn() === 'w' ? whiteAIDifficulty : blackAIDifficulty;
    const depth = difficultyToDepth[currentAIDifficulty];

    // Exit if the game is over or no moves are possible
    if (game.isGameOver() || game.isDraw() || game.moves().length === 0) {
      checkGameOver();
      setIsAITurn(false); // Ensure AI turn indicator is off
      return;
    }

    setIsAITurn(true); // Indicate AI is thinking

    // Use a timeout to simulate thinking time and allow UI to update
    setTimeout(() => {
      const bestMove = findBestMove(game, depth);

      if (bestMove) {
        safeGameMutate((game) => {
          game.move(bestMove);
        });
      }
      setIsAITurn(false); // AI turn ends
    }, 300); // Simulate AI thinking time
  }, [game, whiteAIDifficulty, blackAIDifficulty, safeGameMutate, checkGameOver]);


  // Example move handler (will need more logic later)
  function onDrop(sourceSquare, targetSquare) {
    // Prevent moves if the game is over, it's AI's turn, or the game type is AI vs AI
    if (game.isGameOver() || gameStatus !== 'playing' || isAITurn || gameType === GameType.AI_vs_AI) return false;

    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity
      });
    });

    // If the move is invalid, return null
    if (move === null) {
      setIsInvalidMove(true); // Set invalid move state
      return false;
    }

    // Check for game over after human move
    checkGameOver();

    // Trigger AI move after a short delay if the game is not over and it's AI's turn (Black in Human vs AI)
    if (!game.isGameOver() && game.turn() === 'b' && gameType === GameType.Human_vs_AI) {
      setTimeout(makeAIMove, 300); // Simulate AI thinking time
    }

    setIsInvalidMove(false); // Reset invalid move state on valid move
    return true; // Return move object if valid
  }

  // Undo the last move
  const undoLastMove = () => {
    // Prevent undo if it's AI's turn or game is over or in AI vs AI mode
    if (isAITurn || game.isGameOver() || gameType === GameType.AI_vs_AI) return;

    // If the last move was an AI move, undo twice to get back to human's turn
    if (game.history().length > 0 && game.history({ verbose: true }).slice(-1)[0].color === 'b') {
       safeGameMutate((game) => {
         game.undo(); // Undo AI move
         game.undo(); // Undo human move
       });
    } else {
       safeGameMutate((game) => {
         game.undo(); // Undo human move
       });
    }

    setIsInvalidMove(false); // Reset invalid move state on undo
  };

  // Start AI vs AI game
  const startAIVsAIGame = useCallback(() => {
    // Ensure the game is not already over before starting AI moves
    if (!game.isGameOver() && game.moves().length > 0) {
      makeAIMove(); // Trigger the first AI move (White)
    }
  }, [game, makeAIMove]);


  // Reset game state and set new game parameters
  const resetGame = (
    type: GameType = GameType.Human_vs_AI,
    humanAIDifficulty: GameDifficulty = GameDifficulty.Medium,
    ai1Difficulty: GameDifficulty = GameDifficulty.Medium, // Difficulty for White AI in AI vs AI
    ai2Difficulty: GameDifficulty = GameDifficulty.Medium // Difficulty for Black AI in AI vs AI
  ) => {
    setGame(new Chess());
    setMoves([]);
    setGameStatus('playing');
    setIsAITurn(false); // Reset AI turn state
    setIsInvalidMove(false); // Reset invalid move state
    setGameType(type); // Set the new game type

    if (type === GameType.Human_vs_AI) {
      setAiDifficulty(humanAIDifficulty);
    } else if (type === GameType.AI_vs_AI) {
      setWhiteAIDifficulty(ai1Difficulty);
      setBlackAIDifficulty(ai2Difficulty);
    }
  };

  // Effect to clear invalid move message after a delay
  useEffect(() => {
    if (isInvalidMove) {
      const timer = setTimeout(() => {
        setIsInvalidMove(false);
      }, 2000); // Clear message after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isInvalidMove]); // Dependency on isInvalidMove

  // Effect to trigger AI moves in AI vs AI mode
  useEffect(() => {
    if (gameType === GameType.AI_vs_AI && gameStatus === 'playing' && !isAITurn) {
      // Trigger the next AI move after the game state updates
      // This useEffect runs after safeGameMutate updates the game state
      makeAIMove();
    }
  }, [game, gameType, gameStatus, isAITurn, makeAIMove]); // Dependencies on game, gameType, gameStatus, isAITurn, makeAIMove

  // Effect to start AI vs AI game when the mode is set
  useEffect(() => {
    if (gameType === GameType.AI_vs_AI) {
      startAIVsAIGame();
    }
  }, [gameType, startAIVsAIGame]); // Dependency on gameType and startAIVsAIGame


  // Update history and check game over whenever the game state changes
  useEffect(() => {
    updateMovesHistory();
    checkGameOver();
  }, [game, updateMovesHistory, checkGameOver]); // Dependency on game and helper functions


  // Determine current player for UI indicator
  const currentPlayer = game.turn() === 'w' ? 'white' : 'black';


  return (
    <div className="min-h-screen overflow-hidden flex flex-col px-4 py-6"
      style={{ background: 'hsl(var(--background))' }}>

      {/* Conteneur Principal */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center gap-4">
        {/* Joueur Noir - En Haut */}
        <Card className="w-full max-w-[400px] mb-4">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-base">Noir</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiClock className="w-4 h-4" />
              <span className="text-muted-foreground">15:00</span>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {/* Use game.turn() to determine active player */}
            <div className={`h-1 rounded-full ${game.turn() === 'b' ? 'bg-primary' : 'bg-muted'}`} />
          </CardContent>
        </Card>

        {/* Échiquier */}
        <div className="w-full flex justify-center">
          <div className={`
            aspect-square bg-card rounded-lg border-2 shadow-sm
            w-full max-w-full
            xs:max-w-[320px]
            sm:max-w-[360px]
            md:max-w-[400px]
            ${game.turn() === 'w' ? 'border-primary/20' : 'border-muted'}
          `}>
             <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                boardWidth={Math.min(window.innerWidth * 0.9, 400)} // Responsive width
                arePiecesDraggable={gameType === GameType.Human_vs_AI && !game.isGameOver() && gameStatus === 'playing' && !isAITurn} // Disable drag in AI vs AI or during AI turn or game over
             />
          </div>
        </div>

        {/* Game Status Display */}
        {gameStatus !== 'playing' && (
          <Card className="w-full max-w-[400px] mt-4 text-center">
            <CardContent className="p-3">
              <p className="text-lg font-semibold">Game Over!</p>
              <p className="text-muted-foreground capitalize">{gameStatus}</p>
            </CardContent>
          </Card>
        )}

        {/* Invalid Move Feedback */}
        {isInvalidMove && (
           <Card className="w-full max-w-[400px] mt-4 text-center border-destructive text-destructive">
            <CardContent className="p-3">
              <p className="text-lg font-semibold">Invalid Move!</p>
              <p className="text-muted-foreground text-sm">Please try a different move.</p>
            </CardContent>
          </Card>
        )}

        {/* AI Thinking Indicator */}
        {isAITurn && gameStatus === 'playing' && (
           <Card className="w-full max-w-[400px] mt-4 text-center">
            <CardContent className="p-3">
              <p className="text-lg font-semibold">AI is thinking...</p>
            </CardContent>
          </Card>
        )}


        {/* Joueur Blanc - En Bas */}
        <Card className="w-full max-w-[400px] mt-4">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-base">Blanc</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiClock className="w-4 h-4" />
              <span className="text-muted-foreground">14:30</span>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
             {/* Use game.turn() to determine active player */}
            <div className={`h-1 rounded-full ${game.turn() === 'w' ? 'bg-primary' : 'bg-muted'}`} />
          </CardContent>
        </Card>

        {/* Contrôles Centrés */}
        <div className="w-full flex flex-col sm:flex-row justify-center gap-3 mt-6">
          {/* NewGameModal now handles game reset internally */}
          <NewGameModal onStartGame={resetGame} /> {/* Pass resetGame function */}
          <Button
            variant="secondary"
            className="gap-2 sm:w-auto"
            onClick={undoLastMove}
            disabled={game.history().length === 0 || isAITurn || game.isGameOver() || gameType === GameType.AI_vs_AI} // Disable if no moves or AI turn or game over or AI vs AI
          >
            <FiCornerUpLeft className="w-4 h-4" />
            <span>Annuler Coup</span>
          </Button>
        </div>

        {/* Historique */}
        <Card className="w-full max-w-[600px] mt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="moves">
              <div className="max-h-[40vh] overflow-y-auto">
                <CardHeader className="sticky top-0 bg-background z-10 p-3 border-b">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 text-sm">
                        <FiChevronDown className="h-4 w-4 transition-transform" />
                        <span>Historique des coups</span>
                      </div>
                      <span className="text-muted-foreground text-sm">{moves.length} coups</span>
                    </div>
                  </AccordionTrigger>
                </CardHeader>

                <AccordionContent>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                      <span className="font-medium text-center">Tour</span>
                      <span className="font-medium text-center">Blanc</span>
                      <span className="font-medium text-center">Noir</span>

                      {moves.map((move, index) => (
                        <React.Fragment key={index}>
                          <span className="text-center text-muted-foreground">{move.moveNumber}.</span>
                          <span className="text-center bg-muted p-1 rounded">{move.white}</span>
                          <span className="text-center bg-muted p-1 rounded">{move.black}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </CardContent>
                </AccordionContent>
              </div>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}

    safeGameMutate((game) => {
      game.undo();
    });
    // After undoing, if it's now the AI's turn, trigger AI move
    // This handles the case where the human undid the move that ended the game
    // or undid their move before the AI had a chance to move.
    if (!game.isGameOver() && game.turn() === 'b') {
       // Add a slight delay before AI moves after undo
       setTimeout(makeAIMove, 300);
    }
  };

  // Reset game state and set new difficulty
  const resetGame = (difficulty: GameDifficulty = GameDifficulty.Medium) => {
    setGame(new Chess());
    setMoves([]);
    setGameStatus('playing');
    setIsAITurn(false); // Reset AI turn state
    setAiDifficulty(difficulty); // Set the new difficulty
  };

  // Update history and check game over whenever the game state changes
  useEffect(() => {
    updateMovesHistory();
    checkGameOver();
  }, [game]); // Dependency on game ensures it runs after state updates

  // Determine current player for UI indicator
  const currentPlayer = game.turn() === 'w' ? 'white' : 'black';


  return (
    <div className="min-h-screen overflow-hidden flex flex-col px-4 py-6"
      style={{ background: 'hsl(var(--background))' }}>

      {/* Conteneur Principal */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center gap-4">
        {/* Joueur Noir - En Haut */}
        <Card className="w-full max-w-[400px] mb-4">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-base">Noir</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiClock className="w-4 h-4" />
              <span className="text-muted-foreground">15:00</span>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {/* Use game.turn() to determine active player */}
            <div className={`h-1 rounded-full ${game.turn() === 'b' ? 'bg-primary' : 'bg-muted'}`} />
          </CardContent>
        </Card>

        {/* Échiquier */}
        <div className="w-full flex justify-center">
          <div className={`
            aspect-square bg-card rounded-lg border-2 shadow-sm
            w-full max-w-full
            xs:max-w-[320px]
            sm:max-w-[360px]
            md:max-w-[400px]
            ${game.turn() === 'w' ? 'border-primary/20' : 'border-muted'}
          `}>
             <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                boardWidth={Math.min(window.innerWidth * 0.9, 400)} // Responsive width
                arePiecesDraggable={!game.isGameOver() && gameStatus === 'playing' && !isAITurn} // Disable drag during AI turn or game over
             />
          </div>
        </div>

        {/* Game Status Display */}
        {gameStatus !== 'playing' && (
          <Card className="w-full max-w-[400px] mt-4 text-center">
            <CardContent className="p-3">
              <p className="text-lg font-semibold">Game Over!</p>
              <p className="text-muted-foreground capitalize">{gameStatus}</p>
            </CardContent>
          </Card>
        )}

        {/* AI Thinking Indicator */}
        {isAITurn && gameStatus === 'playing' && (
           <Card className="w-full max-w-[400px] mt-4 text-center">
            <CardContent className="p-3">
              <p className="text-lg font-semibold">AI is thinking...</p>
            </CardContent>
          </Card>
        )}


        {/* Joueur Blanc - En Bas */}
        <Card className="w-full max-w-[400px] mt-4">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-base">Blanc</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiClock className="w-4 h-4" />
              <span className="text-muted-foreground">14:30</span>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
             {/* Use game.turn() to determine active player */}
            <div className={`h-1 rounded-full ${game.turn() === 'w' ? 'bg-primary' : 'bg-muted'}`} />
          </CardContent>
        </Card>

        {/* Contrôles Centrés */}
        <div className="w-full flex flex-col sm:flex-row justify-center gap-3 mt-6">
          {/* NewGameModal now handles game reset internally */}
          <NewGameModal />
          <Button
            variant="secondary"
            className="gap-2 sm:w-auto"
            onClick={undoLastMove}
            disabled={game.history().length === 0 || isAITurn || game.isGameOver()} // Disable if no moves or AI turn or game over
          >
            <FiCornerUpLeft className="w-4 h-4" />
            <span>Annuler Coup</span>
          </Button>
        </div>

        {/* Historique */}
        <Card className="w-full max-w-[600px] mt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="moves">
              <div className="max-h-[40vh] overflow-y-auto">
                <CardHeader className="sticky top-0 bg-background z-10 p-3 border-b">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 text-sm">
                        <FiChevronDown className="h-4 w-4 transition-transform" />
                        <span>Historique des coups</span>
                      </div>
                      <span className="text-muted-foreground text-sm">{moves.length} coups</span>
                    </div>
                  </AccordionTrigger>
                </CardHeader>

                <AccordionContent>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                      <span className="font-medium text-center">Tour</span>
                      <span className="font-medium text-center">Blanc</span>
                      <span className="font-medium text-center">Noir</span>

                      {moves.map((move, index) => (
                        <React.Fragment key={index}>
                          <span className="text-center text-muted-foreground">{move.moveNumber}.</span>
                          <span className="text-center bg-muted p-1 rounded">{move.white}</span>
                          <span className="text-center bg-muted p-1 rounded">{move.black}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </CardContent>
                </AccordionContent>
              </div>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
