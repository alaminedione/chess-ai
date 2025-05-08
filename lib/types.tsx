import { LucideIcon } from "lucide-react"

export interface User {
  name: string
  email: string
  avatar: string
}

export enum GameDifficulty {
  Easy = 'Facile',
  Medium = 'Moyen',
  Hard = 'Difficile',
  Expert = 'Expert',
  None = 'Aucune' // For analysis mode or human vs human
}

// Map difficulty to search depth for the AI
export const difficultyToDepth: Record<GameDifficulty, number> = {
  [GameDifficulty.Easy]: 1,
  [GameDifficulty.Medium]: 2,
  [GameDifficulty.Hard]: 3,
  [GameDifficulty.Expert]: 4,
  [GameDifficulty.None]: 0, // AI doesn't make moves in this mode
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  strength: number; // ELO rating simulation
  apiEndpoint: string; // Placeholder for future API integration
}

export enum GameType {
  Human_vs_AI = 'Humain vs IA',
  AI_vs_AI = 'IA vs IA',
  Analysis = 'Analyse de partie'
}

export interface GameMode {
  name: GameType
  icon: LucideIcon
  // Difficulty is now selected per AI in the modal, not tied to the mode itself
}

export enum MatchStatus {
  InProgress = 'En cours',
  Finished = 'Terminé',
  Registered = 'Inscrit'
}

export interface Match {
  name: string
  url: string
  icon: LucideIcon
  status: MatchStatus
}

