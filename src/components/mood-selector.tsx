"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as Lucide from 'lucide-react';

interface Mood {
  name: string;
  icon: keyof typeof Lucide;
}

interface MoodSelectorProps {
  moods: Mood[];
  selectedMood: string | null;
  onSelectMood: (mood: string) => void;
  loading: boolean;
}

const MoodSelector = ({ moods, selectedMood, onSelectMood, loading }: MoodSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {moods.map((mood) => {
        const Icon = Lucide[mood.icon] as Lucide.LucideIcon;
        return (
          <Button
            key={mood.name}
            variant={selectedMood === mood.name ? 'default' : 'outline'}
            className={cn(
              "flex flex-col h-24 w-full items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg",
              selectedMood === mood.name && "bg-primary text-primary-foreground scale-105 shadow-xl"
            )}
            onClick={() => onSelectMood(mood.name)}
            disabled={loading}
            aria-pressed={selectedMood === mood.name}
          >
            {Icon && <Icon className="h-8 w-8" />}
            <span className="text-sm font-medium">{mood.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
