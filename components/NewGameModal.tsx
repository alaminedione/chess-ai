// components/NewGameModal.tsx
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label'; // Import Label
import { FiRotateCw } from 'react-icons/fi';
import { GameType, GameDifficulty, difficultyToDepth } from '@/lib/types'; // Import types

// Mock AI Models (should eventually come from API or state)
const mockAIModels = [
  { id: '1', name: 'DeepChess', description: 'Modèle de niveau débutant', strength: 800 },
  { id: '2', name: 'AlphaPawn', description: 'Modèle intermédiaire', strength: 1500 },
  { id: '3', name: 'MegaMate', description: 'Modèle expert', strength: 2500 },
];

// Available difficulties for selection
const availableDifficulties = [
  GameDifficulty.Easy,
  GameDifficulty.Medium,
  GameDifficulty.Hard,
  GameDifficulty.Expert,
];

export function NewGameModal() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [gameType, setGameType] = useState<GameType>(GameType.Human_vs_AI);
  const [selectedAI1, setSelectedAI1] = useState<string>('');
  const [selectedAI2, setSelectedAI2] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>(GameDifficulty.Medium); // Default difficulty

  const handleStartGame = () => {
    // Find the selected AI models
    const ai1 = mockAIModels.find(m => m.id === selectedAI1);
    const ai2 = gameType === GameType.AI_vs_AI ? mockAIModels.find(m => m.id === selectedAI2) : null;

    if (!ai1 || (gameType === GameType.AI_vs_AI && !ai2)) {
      // Should not happen if button is disabled, but good practice
      console.error("Invalid AI selection");
      return;
    }

    // Determine the search depth based on selected difficulty
    const searchDepth = difficultyToDepth[selectedDifficulty];

    // In a real app, you would navigate to the game page and pass parameters
    // For now, we'll just close the modal and log the selections.
    console.log("Starting new game:", {
      gameType,
      ai1: ai1.name,
      ai2: ai2?.name,
      difficulty: selectedDifficulty,
      searchDepth,
    });

    // TODO: Implement actual game start logic and navigation
    // Example: router.push(`/game?type=${gameType}&ai1=${selectedAI1}&ai2=${selectedAI2 || ''}&depth=${searchDepth}`);

    setIsDialogOpen(false);
  };

  // Reset selections when the dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setGameType(GameType.Human_vs_AI);
      setSelectedAI1('');
      setSelectedAI2('');
      setSelectedDifficulty(GameDifficulty.Medium); // Reset to default difficulty
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <FiRotateCw className="w-4 h-4" />
          Nouvelle Partie
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choisir une nouvelle partie</DialogTitle>
          <DialogDescription>Sélectionnez les participants et le type de partie</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélection du type de partie */}
          <div className="space-y-2">
            <Label htmlFor="game-type">Type de partie</Label>
            <Select onValueChange={(v) => setGameType(v as GameType)} value={gameType}>
              <SelectTrigger id="game-type">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GameType.Human_vs_AI}>{GameType.Human_vs_AI}</SelectItem>
                <SelectItem value={GameType.AI_vs_AI}>{GameType.AI_vs_AI}</SelectItem>
                {/* Add Analysis mode later if needed */}
                {/* <SelectItem value={GameType.Analysis}>{GameType.Analysis}</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection IA 1 */}
          <div className="space-y-2">
            <Label htmlFor="ai-1">
              {gameType === GameType.Human_vs_AI ? 'IA Adverse' : 'Première IA'}
            </Label>
            <Select onValueChange={setSelectedAI1} value={selectedAI1}>
              <SelectTrigger id="ai-1">
                <SelectValue placeholder="Sélectionnez une IA" />
              </SelectTrigger>
              <SelectContent>
                {mockAIModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span>{model.name}</span>
                      <span className="text-xs text-muted-foreground">
                          {model.description} (ELO: {model.strength})
                        </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection IA 2 (seulement pour AI vs AI) */}
          {gameType === GameType.AI_vs_AI && (
            <div className="space-y-2">
              <Label htmlFor="ai-2">Deuxième IA</Label>
              <Select onValueChange={setSelectedAI2} value={selectedAI2}>
                <SelectTrigger id="ai-2">
                  <SelectValue placeholder="Sélectionnez une IA" />
                </SelectTrigger>
                <SelectContent>
                  {mockAIModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col">
                        <span>{model.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {model.description} (ELO: {model.strength})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sélection de la difficulté (seulement pour Human vs AI) */}
          {gameType === GameType.Human_vs_AI && selectedAI1 && (
             <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulté de l'IA</Label>
              <Select onValueChange={(v) => setSelectedDifficulty(v as GameDifficulty)} value={selectedDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Sélectionnez une difficulté" />
                </SelectTrigger>
                <SelectContent>
                  {availableDifficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}


          <Button
            className="w-full mt-4"
            onClick={handleStartGame}
            disabled={!selectedAI1 || (gameType === GameType.AI_vs_AI && !selectedAI2)}
          >
            Commencer la partie
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


