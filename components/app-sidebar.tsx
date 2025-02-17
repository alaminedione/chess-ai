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
// import { GameModeSwitcher } from "@/components/game-mode-switcher"
import { NavMatches } from "@/components/nav-matches"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { user, gameMode, gameDifficulty, gameType, Match } from "@/lib/types"

interface IChessData {
  user: user,
  gameModes: gameMode[],
  currentMatches: Match[],
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
      name: gameType.Humain_vs_AI,
      icon: User,
      difficulty: gameDifficulty.Adaptatif,
    },
    {
      name: gameType.AI_vs_AI,
      icon: Cpu,
      difficulty: gameDifficulty.Expert,
    },
    {
      name: gameType.Analyse_de_partie,
      icon: BarChart,
      difficulty: gameDifficulty.none,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: Crown,
      isActive: true,
      items: [
        {
          title: "Partie en cours",
          url: "#",
          icon: Crosshair,
        },
        {
          title: "Statistiques",
          url: "#",
          icon: Trophy,
        },
        {
          title: "Historique",
          url: "#",
          icon: Clock,
        },
      ],
    },
    {

      title: "Modèles IA",
      isActive: true,
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Mes Modèles",
          url: "#",
        },
      ],
    },
    {
      title: "Matchs",
      isActive: true,
      url: "#",
      icon: Sword,
      items: [
        {
          title: "Créer un match",
          url: "#",
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
      isActive: true,
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profil",
          url: "#",
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
    //   status: matchStatus.En_cours
    // },
    // {
    //   name: "Tournoi Quotidien",
    //   url: "#",
    //   icon: Trophy,
    //   status: matchStatus.Inscrit
    // },
    // {
    //   name: "Analyse de partie",
    //   url: "#",
    //   icon: BookOpen,
    //   status: matchStatus.Termine
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
