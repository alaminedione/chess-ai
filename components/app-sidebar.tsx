"use client"

import {
  Crown,
  Bot,
  Sword,
  Crosshair,
  Clock,
  Cpu,
  User,
  Settings2,
  BookOpen,
  Trophy,
  BarChart,
  LucideIcon
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { GameModeSwitcher } from "@/components/game-mode-switcher"
import { NavMatches } from "@/components/nav-matches"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { User as UserType, GameMode, GameType, Match, MatchStatus, GameDifficulty } from "@/lib/types" // Use alias for User type

interface IChessData {
  user: UserType, // Use aliased User type
  gameModes: GameMode[], // Use GameMode type
  currentMatches: Match[], // Use Match type
  navMain: {
    title: string
    url: string
    icon: LucideIcon
    isActive: boolean
    items: {
      title: string
      url: string
      icon?: LucideIcon
    }[]
  }[],

}

const chessData: IChessData = {
  user: {
    name: "Joueur d'Échecs",
    email: "player@chessai.com",
    avatar: "/avatars/chess-king.png",
  },
  gameModes: [
    {
      name: GameType.Human_vs_AI,
      icon: User,
      // Difficulty is now selected per AI in the modal
    },
    {
      name: GameType.AI_vs_AI,
      icon: Cpu,
      // Difficulty is now selected per AI in the modal
    },
    {
      name: GameType.Analysis,
      icon: BarChart,
      // Difficulty is not applicable here
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/", // Link to home page
      icon: Crown,
      isActive: true, // Consider making this dynamic based on current route
      items: [
        {
          title: "Partie en cours",
          url: "/game", // Link to game page
          icon: Crosshair,
        },
        {
          title: "Statistiques",
          url: "#", // Placeholder
          icon: Trophy,
        },
        {
          title: "Historique",
          url: "#", // Placeholder
          icon: Clock,
        },
      ],
    },
    {

      title: "Modèles IA",
      isActive: true, // Consider making this dynamic
      url: "/ai-models", // Link to AI models page
      icon: Bot,
      items: [
        {
          title: "Mes Modèles",
          url: "/ai-models", // Link to AI models page
        },
      ],
    },
    {
      title: "Matchs",
      isActive: true, // Consider making this dynamic
      url: "#", // Placeholder
      icon: Sword,
      items: [
        {
          title: "Créer un match",
          url: "#", // Placeholder
          icon: BookOpen,
        },
        // {
        //   title: "Matchs publics",
        //   url: "#",
        //   icon: BookOpen,
        // },
        // {
        //   title: "Tournois",
        //   url: "#",
        //   icon: Trophy,
        // },
      ],
    },
    {
      title: "Paramètres",
      isActive: true, // Consider making this dynamic
      url: "#", // Placeholder
      icon: Settings2,
      items: [
        {
          title: "Profil",
          url: "#", // Placeholder
          icon: User,
        },
        // {
        //   title: "Performance",
        //   url: "#",
        //   icon: Cpu,
        // },
        // {
        //   title: "Système",
        //   url: "#",
        //   icon: Cpu,
        // },
      ],
    },
  ],
  currentMatches: [
    // {
    //   name: "Match #1 vs Stockfish",
    //   url: "#",
    //   icon: Crosshair,
    //   status: MatchStatus.InProgress
    // },
    // {
    //   name: "Tournoi Quotidien",
    //   url: "#",
    //   icon: Trophy,
    //   status: MatchStatus.Registered
    // },
    // {
    //   name: "Analyse de partie",
    //   url: "#",
    //   icon: BookOpen,
    //   status: MatchStatus.Finished
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r border-muted bg-background"
    >
      <SidebarHeader >
      </SidebarHeader>

      <SidebarContent className="space-y-6">
        {/* GameModeSwitcher no longer needs difficulty prop */}
        <GameModeSwitcher modes={chessData.gameModes} />
        <NavMain
          items={chessData.navMain}
          className="[&_.active]:bg-primary/10 [&_.active]:text-primary"
        />

        <NavMatches
          matches={[...chessData.currentMatches]}
          title="Matchs Actifs"
          className="border-t pt-6"
        />
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <NavUser
          user={chessData.user}
          className="hover:bg-muted/50 rounded-lg p-2 transition-colors"
        />
      </SidebarFooter>

      <SidebarRail className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />
    </Sidebar>
  )
}
