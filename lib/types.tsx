import { LucideIcon } from "lucide-react"

export interface user {
  name: string
  email: string
  avatar: string
}

export interface gameMode {
  name: gameType
  icon: LucideIcon
  difficulty: gameDifficulty
}

export enum gameDifficulty {
  Adaptatif,
  Expert,
  none
}
export enum gameType {
  Humain_vs_AI,
  AI_vs_AI,
  Analyse_de_partie
}



export enum matchStatus {
  En_cours,
  Termine,
  Inscrit
}

export interface Match {
  name: string
  url: string
  icon: LucideIcon
  status: matchStatus
}

