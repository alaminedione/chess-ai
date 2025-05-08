// components/NewGameModal.tsx
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// Ajouter dans votre fichier d'icônes
import { FiRotateCw } from 'react-icons/fi';
// Modèles IA fictifs
const mockAIModels = [
  { id: '1', name: 'DeepChess', description: 'Modèle de niveau débutant', strength: 800 },
  { id: '2', name: 'AlphaPawn', description: 'Modèle intermédiaire', strength: 1500 },
  { id: '3', name: 'MegaMate', description: 'Modèle expert', strength: 2500 },
];

export function NewGameModal() {
  const [gameType, setGameType] = useState<'human-vs-ai' | 'ai-vs-ai'>('human-vs-ai');
  const [selectedAI1, setSelectedAI1] = useState<string>('');
  const [selectedAI2, setSelectedAI2] = useState<string>('');

  const handleStartGame = () => {
    // Simulation de démarrage de partie
    const ai1 = mockAIModels.find(m => m.id === selectedAI1);
    const ai2 = gameType === 'ai-vs-ai' ? mockAIModels.find(m => m.id === selectedAI2) : null;

    // Simulation de démarrage de partie
    const ai1 = mockAIModels.find(m => m.id === selectedAI1);
    const ai2 = gameType === 'ai-vs-ai' ? mockAIModels.find(m => m.id === selectedAI2) : null;

    // In a real app, you would navigate to the game page and pass parameters
    // For now, we'll just close the modal.
    setIsDialogOpen(false);
    // Example navigation (requires useRouter hook)
    // router.push(`/game?type=${gameType}&ai1=${selectedAI1}${ai2 ? `&ai2=${selectedAI2}` : ''}`);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <label className="block text-sm font-medium">Type de partie</label>
            <Select onValueChange={(v) => setGameType(v as 'human-vs-ai' | 'ai-vs-ai')}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human-vs-ai">Joueur vs IA</SelectItem>
                <SelectItem value="ai-vs-ai">IA vs IA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sélection IA 1 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {gameType === 'human-vs-ai' ? 'IA Adverse' : 'Première IA'}
            </label>
            <Select onValueChange={setSelectedAI1}>
              <SelectTrigger>
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
          {gameType === 'ai-vs-ai' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Deuxième IA</label>
              <Select onValueChange={setSelectedAI2}>
                <SelectTrigger>
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

          <Button
            className="w-full mt-4"
            onClick={handleStartGame}
            disabled={!selectedAI1 || (gameType === 'ai-vs-ai' && !selectedAI2)}
          >
            Commencer la partie
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


