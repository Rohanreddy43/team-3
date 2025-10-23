import { UtensilsCrossed } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="flex items-center gap-3">
        <UtensilsCrossed className="h-10 w-10 text-primary" />
        <h1 className="font-headline text-5xl font-bold tracking-tight">
          MoodMeal
        </h1>
      </div>
      <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
        Discover the perfect dish to match your mood.
      </p>
    </header>
  );
};

export default Header;
