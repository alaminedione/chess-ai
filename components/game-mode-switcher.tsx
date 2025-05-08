// components/game-mode-switcher.tsx
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { GameMode } from "@/lib/types" // Use GameMode type

export function GameModeSwitcher({ modes }: { modes: GameMode[] }) {
  const [open, setOpen] = React.useState(false)
  const [selectedMode, setSelectedMode] = React.useState(modes[0])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <selectedMode.icon className="h-5 w-5 text-primary" />
            <span className="truncate">{selectedMode.name}</span>
            {/* Difficulty is no longer displayed here */}
            {/* <span className="text-muted-foreground text-xs ml-2">
              {selectedMode.difficulty}
            </span> */}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un mode..." />
          <CommandEmpty>Aucun mode trouvé.</CommandEmpty>
          <CommandGroup>
            {modes.map((mode) => (
              <CommandItem
                key={mode.name}
                onSelect={() => {
                  setSelectedMode(mode)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedMode.name === mode.name ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-3">
                  <mode.icon className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span>{mode.name}</span>
                    {/* Difficulty is no longer displayed here */}
                    {/* <span className="text-xs text-muted-foreground">
                      {mode.difficulty}
                    </span> */}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
