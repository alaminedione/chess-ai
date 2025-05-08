"use client";
import { useState, useEffect, useMemo } from 'react';
import { FiClock, FiUser, FiChevronDown, FiRotateCw, FiCornerUpLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NewGameModal } from '@/components/NewGameModal';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

import { useState, useEffect, useMemo } from 'react';
import { FiClock, FiUser, FiChevronDown, FiRotateCw, FiCornerUpLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NewGameModal } from '@/components/NewGameModal';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'threefold repetition' | 'insufficient material' | 'fifty-move rule' | 'draw' | 'resignation';

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]); // Start with empty moves
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');

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

  // Basic AI move function (random move)
  const makeAIMove = () => {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) {
      checkGameOver();
      return;
    }

    // Choose a random move
    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    // Apply the move
    safeGameMutate((game) => {
      game.move(randomMove);
    });
  };


  // Example move handler (will need more logic later)
  function onDrop(sourceSquare, targetSquare) {
    // Prevent moves if the game is over
    if (game.isGameOver() || gameStatus !== 'playing') return false;

    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity
      });
    });

    // If the move is invalid, return null
    if (move === null) return false;

    // Check for game over after human move
    checkGameOver();

    // Trigger AI move after a short delay if the game is not over
    if (!game.isGameOver()) {
      setTimeout(makeAIMove, 300); // Simulate AI thinking time
    }


    return true; // Return move object if valid
  }

  // Reset game state
  const resetGame = () => {
    setGame(new Chess());
    setMoves([]);
    setGameStatus('playing');
  };

  // Update history whenever the game state changes
  useEffect(() => {
    updateMovesHistory();
    // Also check game over status after any state change (including AI move)
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
          {/* Modified NewGameModal trigger to reset game */}
          <Button variant="default" className="gap-2 sm:w-auto" onClick={resetGame}>
            <FiRotateCw className="w-4 h-4" />
            Nouvelle Partie
          </Button>
          <Button variant="secondary" className="gap-2 sm:w-auto">
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
