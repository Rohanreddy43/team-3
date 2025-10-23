"use client";

import type { Meal } from '@/app/page';
import MealCard from '@/components/meal-card';
import { Skeleton } from '@/components/ui/skeleton';

interface MealListProps {
  meals: Meal[];
  loading: boolean;
  toggleFavorite: (meal: Meal) => void;
  isFavorite: (meal: Meal) => boolean;
  hasSelectedMood: boolean;
}

const MealCardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[225px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const MealList = ({ meals, loading, toggleFavorite, isFavorite, hasSelectedMood }: MealListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {[...Array(6)].map((_, i) => <MealCardSkeleton key={i} />)}
      </div>
    );
  }
  
  if (!hasSelectedMood) {
    return null;
  }
  
  if (meals.length === 0) {
    return <p className="text-center text-muted-foreground pt-6">No meals found for this mood. Try another one!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6 animate-in fade-in-50 duration-500">
      {meals.map((meal, index) => (
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

export default MealList;
