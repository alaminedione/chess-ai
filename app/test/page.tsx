// components/chess/ChessGame.tsx
"use client";
import { useState } from 'react';
import { FiClock, FiUser, FiChevronDown, FiRotateCw, FiCornerUpLeft } from 'react-icons/fi';
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
            <div className={`h-1 rounded-full ${currentPlayer === 'black' ? 'bg-primary' : 'bg-muted'}`} />
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
            ${currentPlayer === 'white' ? 'border-primary/20' : 'border-muted'}
          `}>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">Échiquier</span>
            </div>
          </div>
        </div>

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
            <div className={`h-1 rounded-full ${currentPlayer === 'white' ? 'bg-primary' : 'bg-muted'}`} />
          </CardContent>
        </Card>

        {/* Contrôles Centrés */}
        <div className="w-full flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <Button variant="default" className="gap-2 sm:w-auto">
            <NewGameModal />
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

                      {moves.map((move) => (
                        <>
                          <span className="text-center text-muted-foreground">{move.moveNumber}.</span>
                          <span className="text-center bg-muted p-1 rounded">{move.white}</span>
                          <span className="text-center bg-muted p-1 rounded">{move.black}</span>
                        </>
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
