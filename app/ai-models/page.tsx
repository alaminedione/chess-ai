// app/ai-models/page.tsx
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FiPlus, FiEdit, FiTrash, FiSave, FiX } from 'react-icons/fi';

type AIModel = {
  id: string;
  name: string;
  description: string;
  strength: number;
  apiEndpoint: string;
};

export default function AIModelManager() {
  const [models, setModels] = useState<AIModel[]>([
    { id: '1', name: 'DeepChess', description: 'Modèle débutant', strength: 800, apiEndpoint: 'api/deepchess' },
    { id: '2', name: 'AlphaPawn', description: 'Modèle intermédiaire', strength: 1500, apiEndpoint: 'api/alphapawn' },
  ]);

  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const newModel = {
      id: editingModel?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      strength: Number(formData.get('strength')),
      apiEndpoint: formData.get('apiEndpoint') as string,
    };

    setModels(prev =>
      editingModel
        ? prev.map(m => m.id === editingModel.id ? newModel : m)
        : [...prev, newModel]
    );

    setIsDialogOpen(false);
    setEditingModel(null);
  };

  const handleDelete = (id: string) => {
    setModels(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Gestion des Modèles IA</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingModel(null)}>
                <FiPlus className="mr-2" /> Ajouter un modèle
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingModel ? 'Modifier le modèle' : 'Nouveau modèle IA'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Nom du modèle</label>
                  <Input
                    name="name"
                    defaultValue={editingModel?.name}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Description</label>
                  <Input
                    name="description"
                    defaultValue={editingModel?.description}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Niveau (0-3000)</label>
                  <Input
                    type="number"
                    name="strength"
                    defaultValue={editingModel?.strength}
                    min="0"
                    max="3000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Endpoint API</label>
                  <Input
                    name="apiEndpoint"
                    defaultValue={editingModel?.apiEndpoint}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingModel(null);
                    }}
                  >
                    <FiX className="mr-2" /> Annuler
                  </Button>
                  <Button type="submit">
                    <FiSave className="mr-2" /> Sauvegarder
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>{model.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-accent">
                      ELO {model.strength}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {model.apiEndpoint}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingModel(model);
                        setIsDialogOpen(true);
                      }}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(model.id)}
                    >
                      <FiTrash className="text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground">
          {models.length} modèle(s) IA configuré(s)
        </CardFooter>
      </Card>
    </div>
  );
}
