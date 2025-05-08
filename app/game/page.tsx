"use client";
import { useState } from 'react';
import { FiClock, FiUser, FiChevronDown, FiCornerUpLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NewGameModal } from '@/components/NewGameModal';

const exampleMoves = [
  { moveNumber: 1, white: 'e4', black: 'e5' },
  { moveNumber: 2, white: 'Nf3', black: 'Nc6' },
  { moveNumber: 3, white: 'Bc4', black: 'Bc5' },
];

export default function ChessGame() {
  const [moves, setMoves] = useState(exampleMoves);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Layout Principal */}
      <div className="flex-1 grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-4 p-4">
        {/* Colonne Gauche - Joueurs + Échiquier */}
        <div className="h-full flex flex-col gap-4 mx-auto w-full max-w-[800px]">
          {/* Joueur Noir */}
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <FiUser className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold">Noir</CardTitle>
              </div>
              <div className="flex items-center gap-3 text-base">
                <FiClock className="w-5 h-5" />
                <span className="font-medium">15:00</span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className={`h-2 rounded-full ${currentPlayer === 'black' ? 'bg-primary' : 'bg-muted'}`} />
            </CardContent>
          </Card>

          {/* Échiquier Responsive */}
          <div className="flex-1 flex justify-center items-center p-2">
            <div className={`
              aspect-square bg-card rounded-xl border shadow-lg
              w-full
              min-w-[300px]
              max-w-[90vw]
              md:max-w-[75vw]
              lg:max-w-[500px]
              xl:max-w-[600px]
              ${currentPlayer === 'white' ? 'border-primary/30' : 'border-muted'}
            `}>
              <div className="w-full h-full flex items-center justify-center">
                {/* Placeholder for the chessboard component */}
                <div className="text-muted-foreground text-lg">Chessboard Placeholder</div>
              </div>
            </div>
          </div>

          {/* Joueur Blanc */}
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <FiUser className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold">Blanc</CardTitle>
              </div>
              <div className="flex items-center gap-3 text-base">
                <FiClock className="w-5 h-5" />
                <span className="font-medium">14:30</span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className={`h-2 rounded-full ${currentPlayer === 'white' ? 'bg-primary' : 'bg-muted'}`} />
            </CardContent>
          </Card>
        </div>

        {/* Colonne Droite - Historique */}
        <div className="flex flex-col gap-4 h-full mx-auto w-full max-w-[800px] lg:max-w-[400px]">
          {/* Contrôles */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NewGameModal />
            <Button variant="secondary" className="gap-2">
              <FiCornerUpLeft className="w-4 h-4" />
              <span>Annuler Coup</span>
            </Button>
          </div>

          {/* Historique des Coups */}
          <Card className="flex-1 flex flex-col">
            <Accordion type="single" collapsible>
              <AccordionItem value="moves" className="border-0 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col overflow-hidden">
                  <CardHeader className="sticky top-0 bg-background z-10 p-4 border-b">
                    <AccordionTrigger className="hover:no-underline p-0">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3 text-base">
                          <FiChevronDown className="h-5 w-5 shrink-0 transition-transform" />
                          <span className="font-medium">Historique des coups</span>
                        </div>
                        <span className="text-muted-foreground">{moves.length} coups</span>
                      </div>
                    </AccordionTrigger>
                  </CardHeader>

                  <AccordionContent className="flex-1 overflow-auto">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4 text-base">
                        <div className="font-semibold text-center">Tour</div>
                        <div className="font-semibold text-center">Blanc</div>
                        <div className="font-semibold text-center">Noir</div>

                        {moves.map((move) => (
                          <div key={move.moveNumber} className="contents">
                            <div className="text-center text-muted-foreground py-2">
                              {move.moveNumber}.
                            </div>
                            <div className="text-center bg-muted/50 p-2 rounded-md">
                              {move.white}
                            </div>
                            <div className="text-center bg-muted/50 p-2 rounded-md">
                              {move.black}
                            </div>
                          </div>
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
    </div>
  );
}
