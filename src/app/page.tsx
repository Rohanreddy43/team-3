"use client";

import { useState } from 'react';
import type { SuggestMealsBasedOnMoodOutput } from '@/ai/flows/suggest-meals-based-on-mood';
import { suggestMealsBasedOnMood } from '@/ai/flows/suggest-meals-based-on-mood';

import { useToast } from "@/hooks/use-toast";
import useLocalStorage from '@/hooks/use-local-storage';

import Header from '@/components/header';
import MoodSelector from '@/components/mood-selector';
import MealList from '@/components/meal-list';
import FavoritesList from '@/components/favorites-list';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export type Meal = SuggestMealsBasedOnMoodOutput['mealSuggestions'][0];

const moods = [
  { name: 'Happy', icon: 'Smile' },
  { name: 'Stressed', icon: 'BrainCircuit' },
  { name: 'Sad', icon: 'Frown' },
  { name: 'Calm', icon: 'Wind' },
  { name: 'Energetic', icon: 'Zap' },
  { name: 'Creative', icon: 'Paintbrush' },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<Meal[]>('moodmeal-favorites', []);
  const { toast } = useToast();

  const handleMoodSelect = async (mood: string) => {
    if (loading) return;
    setSelectedMood(mood);
    setLoading(true);
    setMeals([]);
    try {
      const result = await suggestMealsBasedOnMood({ mood: mood.toLowerCase() });
      if (result && result.mealSuggestions) {
        setMeals(result.mealSuggestions);
      }
    } catch (error) {
      console.error("Failed to get meal suggestions:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "We couldn't get meal suggestions for you. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (meal: Meal) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.name === meal.name);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.name !== meal.name);
      } else {
        return [...prevFavorites, meal];
      }
    });
  };

  const isFavorite = (meal: Meal) => {
    return favorites.some(fav => fav.name === meal.name);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <div className="mt-8">
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestions">
            <Card>
              <CardContent className="space-y-6 p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-headline">How are you feeling today?</h2>
                  <p className="text-muted-foreground">Select a mood to get personalized meal suggestions.</p>
                </div>
                <MoodSelector moods={moods} selectedMood={selectedMood} onSelectMood={handleMoodSelect} loading={loading} />
                <MealList meals={meals} loading={loading} toggleFavorite={toggleFavorite} isFavorite={isFavorite} hasSelectedMood={!!selectedMood} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="favorites">
            <Card>
              <CardContent className="p-6">
                 <FavoritesList favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
