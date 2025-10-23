"use client";

import type { Meal } from '@/app/page';
import Image from 'next/image';
import { Heart, ChefHat, Info, Zap, Thermometer, Timer } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MealCardProps {
  meal: Meal;
  toggleFavorite: (meal: Meal) => void;
  isFavorite: boolean;
}

const MealCard = ({ meal, toggleFavorite, isFavorite }: MealCardProps) => {
  const imageId = meal.name.replace(/\s+/g, '-').toLowerCase();
  const imageHint = PlaceHolderImages.find(img => img.id === imageId)?.imageHint || 'food meal';

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
      <CardHeader className="p-0">
        <div className="relative h-60 w-full">
          <Image
            src={meal.image}
            alt={meal.name}
            data-ai-hint={imageHint}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="font-headline text-2xl">{meal.name}</CardTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {meal.calories}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {meal.time}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              {meal.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-6 pt-2 pb-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ingredients">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Ingredients
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {meal.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Instructions
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{meal.instructions}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => toggleFavorite(meal)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn("mr-2 h-4 w-4", isFavorite && "fill-destructive text-destructive")} />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealCard;
