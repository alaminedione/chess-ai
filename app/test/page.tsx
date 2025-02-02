// app/chess/page.tsx
"use client"; // Nécessaire pour utiliser des hooks et des interactions

import { useState } from "react";

export default function ChessPage() {
  const [boardSize, setBoardSize] = useState(400); // Taille initiale du plateau

  // Fonction pour générer le plateau d'échecs
  const renderChessboard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isDark = (row + col) % 2 === 1;
        squares.push(
          <div
            key={`${row}-${col}`}
            className={`w-1/8 h-1/8 ${isDark ? "bg-green-800" : "bg-green-200"}`}
          ></div>
        );
      }
    }
    return squares;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10">
        {/* Plateau d'échecs */}
        <div className="flex justify-center">
          <div
            className="grid grid-cols-8 grid-rows-8"
            style={{
              width: boardSize,
              height: boardSize,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            {renderChessboard()}
          </div>
        </div>

        {/* Informations de jeu */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-auto">
          {/* Joueurs et timers */}
          <div className="bg-card p-4 rounded-lg shadow-md border border-border">
            <h3 className="text-lg lg:text-xl font-bold text-foreground">Joueur 1 (Blanc)</h3>
            <p className="text-muted-foreground">Temps restant : 10:00</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-md border border-border">
            <h3 className="text-lg lg:text-xl font-bold text-foreground">Joueur 2 (Noir)</h3>
            <p className="text-muted-foreground">Temps restant : 10:00</p>
          </div>

          {/* Pièces capturées */}
          <div className="bg-card p-4 rounded-lg shadow-md border border-border">
            <h3 className="text-lg lg:text-xl font-bold text-foreground">Pièces capturées</h3>
            <div className="flex gap-2 mt-2">
              <span className="text-2xl lg:text-3xl">♟️</span>
              <span className="text-2xl lg:text-3xl">♜</span>
            </div>
          </div>

          {/* Boutons de contrôle */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <button className="bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 text-base lg:text-lg">
              Nouvelle partie
            </button>
            <button className="bg-destructive text-destructive-foreground py-2 px-4 rounded-lg hover:bg-destructive/90 text-base lg:text-lg">
              Abandonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
