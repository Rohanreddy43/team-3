"use client";

import type { Meal } from '@/app/page';
import MealCard from '@/components/meal-card';
import { HeartCrack } from 'lucide-react';

interface FavoritesListProps {
  favorites: Meal[];
  toggleFavorite: (meal: Meal) => void;
  isFavorite: (meal: Meal) => boolean;
}

const FavoritesList = ({ favorites, toggleFavorite, isFavorite }: FavoritesListProps) => {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <HeartCrack className="h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-headline">No Favorites Yet</h3>
        <p className="mt-1 text-muted-foreground">Start exploring and save meals you love!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {favorites.map((meal, index) => (
        <MealCard
          key={`${meal.name}-${index}`}
          meal={meal}
          toggleFavorite={toggleFavorite}
          isFavorite={isFavorite(meal)}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
