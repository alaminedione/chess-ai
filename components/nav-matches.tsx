// components/nav-matches.tsx
"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Match, matchStatus } from "@/lib/types"


type NavMatchesProps = {
  matches: Match[]
  title: string
} & React.HTMLAttributes<HTMLDivElement>

export function NavMatches({ matches, title, className }: NavMatchesProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1">
        {matches.map((match) => {
          const Icon = match.icon
          return (
            <Link
              key={match.name}
              href={match.url}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                "hover:bg-muted/50",
                "justify-between"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-primary" />
                <span className="truncate">{match.name}</span>
              </div>
              <Badge
                variant={
                  match.status === matchStatus.En_cours ? "default" :
                    match.status === matchStatus.Termine ? "secondary" : "outline"
                }
                className={cn(
                  "text-xs capitalize",
                  match.status === matchStatus.Inscrit && "border-yellow-300 text-yellow-300 bg-yellow-300/10"
                )}
              >
                {match.status}
              </Badge>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
