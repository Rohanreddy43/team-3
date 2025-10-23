'use server';
/**
 * @fileOverview Suggests meals based on the user's selected mood.
 *
 * - suggestMealsBasedOnMood - A function that suggests meals based on the selected mood.
 * - SuggestMealsBasedOnMoodInput - The input type for the suggestMealsBasedOnMood function.
 * - SuggestMealsBasedOnMoodOutput - The return type for the suggestMealsBasedOnMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImageForMeal = (mealName: string) => {
  const imageName = mealName.replace(/\s+/g, '-').toLowerCase();
  const image = PlaceHolderImages.find(img => img.id === imageName);
  return image?.imageUrl || `https://picsum.photos/seed/${imageName}/600/400`;
};

const mealData = {
  happy: [
    {
      name: 'Paneer Butter Masala',
      calories: '~420 kcal',
      time: '35 min',
      difficulty: 'Medium',
      ingredients: ['Paneer – 250g (cubed)', 'Butter – 2 tbsp', 'Tomato puree – 2 medium tomatoes', 'Onion – 1 (chopped)', 'Ginger-garlic paste – 1 tsp', 'Garam masala – 1 tsp', 'Red chili powder – 1 tsp', 'Turmeric – ½ tsp', 'Cream – 3 tbsp', 'Salt – to taste'],
      instructions: 'Heat butter, sauté onions till golden.\nAdd ginger-garlic paste and cook for 1 min.\nAdd tomato puree, spices, and cook till oil separates.\nStir in cream and paneer; simmer 5 mins.\nGarnish with coriander and serve hot.',
    },
    {
      name: 'Pani Puri',
      calories: '~180 kcal',
      time: '25 min',
      difficulty: 'Easy',
      ingredients: ['Puris – 20', 'Boiled potatoes – 2', 'Boiled chickpeas – ½ cup', 'Chaat masala – 1 tsp', 'Mint, coriander, green chili, lemon juice – for water'],
      instructions: 'Blend mint, coriander, chili, and lemon juice with water and salt.\nMix potatoes, chickpeas, and chaat masala.\nFill puris with the mixture, dip in mint water, and serve immediately.',
    },
    {
      name: 'Mango Lassi',
      calories: '200 kcal',
      time: '10 min',
      difficulty: 'Easy',
      ingredients: ['Yogurt – 1 cup', 'Mango pulp – ½ cup', 'Sugar – 1 tbsp', 'Cardamom – a pinch'],
      instructions: 'Blend all ingredients till smooth. Serve chilled with ice cubes.',
    },
    {
      name: 'Masala Dosa',
      calories: '300 kcal',
      time: '45 min',
      difficulty: 'Medium',
      ingredients: ['Dosa batter – 2 cups', 'Potatoes – 2 boiled', 'Onion – 1 chopped', 'Mustard seeds – ½ tsp', 'Turmeric – ¼ tsp'],
      instructions: 'Heat oil, add mustard seeds and onions.\nAdd turmeric and mashed potatoes.\nSpread batter on tawa, cook, fill with masala, fold and serve.',
    },
    {
      name: 'Jalebi',
      calories: '250 kcal',
      time: '40 min',
      difficulty: 'Medium',
      ingredients: ['Maida – 1 cup', 'Curd – 2 tbsp', 'Sugar – 1 cup', 'Water – ½ cup', 'Ghee – for frying'],
      instructions: 'Ferment batter for 8 hrs.\nMake sugar syrup.\nFry spirals till crisp; dip in syrup; serve warm.',
    },
    {
      name: 'Pav Bhaji',
      calories: '380 kcal',
      time: '30 min',
      difficulty: 'Easy',
      ingredients: ['Potatoes – 2', 'Capsicum – ½ cup', 'Peas – ½ cup', 'Onion – 1', 'Tomato – 1', 'Pav bhaji masala – 1 tbsp', 'Butter – 2 tbsp'],
      instructions: 'Cook vegetables, mash well.\nFry onions and tomatoes in butter; add masala and veggies.\nServe with butter-toasted pav.',
    }
  ],
  sad: [
    {
      name: 'Khichdi',
      calories: '280 kcal',
      time: '25 min',
      difficulty: 'Easy',
      ingredients: ['Rice – ½ cup', 'Moong dal – ¼ cup', 'Ghee – 1 tbsp', 'Turmeric, salt – to taste'],
      instructions: 'Wash rice & dal, cook with turmeric and 3 cups water.\nAdd ghee, salt, and serve warm with pickle.',
    },
    {
      name: 'Masala Chai',
      calories: '120 kcal',
      time: '10 min',
      difficulty: 'Easy',
      ingredients: ['Milk – 1 cup', 'Tea leaves – 1 tsp', 'Sugar – 1 tsp', 'Ginger, cardamom – crushed'],
      instructions: 'Boil milk with water, add tea, sugar, and spices; strain and serve hot.',
    },
    {
      name: 'Rajma Chawal',
      calories: '400 kcal',
      time: '50 min',
      difficulty: 'Medium',
      ingredients: ['Kidney beans – 1 cup (soaked overnight)', 'Onion, tomato – 1 each', 'Ginger-garlic paste – 1 tsp', 'Garam masala – 1 tsp'],
      instructions: 'Pressure cook rajma till soft.\nMake masala from onion-tomato paste and spices.\nAdd rajma, simmer 10 mins. Serve with rice.',
    },
    {
      name: 'Gajar Halwa',
      calories: '350 kcal',
      time: '45 min',
      difficulty: 'Medium',
      ingredients: ['Grated carrots – 2 cups', 'Milk – 2 cups', 'Sugar – ¼ cup', 'Ghee – 2 tbsp', 'Cashews – for garnish'],
      instructions: 'Cook carrots in milk till soft.\nAdd sugar and ghee; simmer till thick.\nGarnish with nuts.',
    },
    {
      name: 'Tomato Soup',
      calories: '150 kcal',
      time: '25 min',
      difficulty: 'Easy',
      ingredients: ['Tomatoes – 5', 'Garlic – 2 cloves', 'Pepper, salt – to taste'],
      instructions: 'Boil tomatoes, blend, strain, and simmer with butter and pepper.',
    },
    {
      name: 'Poha',
      calories: '250 kcal',
      time: '20 min',
      difficulty: 'Easy',
      ingredients: ['Flattened rice – 1 cup', 'Onion – 1', 'Mustard seeds – ½ tsp', 'Turmeric – ¼ tsp'],
      instructions: 'Wash poha, keep aside.\nTemper mustard seeds, onions, turmeric.\nAdd poha, mix gently, serve hot.',
    }
  ],
  calm: [
    {
      name: 'Lemon Rice',
      calories: '320 kcal',
      time: '20 min',
      difficulty: 'Easy',
      ingredients: ['Cooked rice – 2 cups', 'Lemon juice – 2 tbsp', 'Mustard seeds, curry leaves – ½ tsp each'],
      instructions: 'Temper mustard seeds, curry leaves.\nMix with rice and lemon juice; serve.',
    },
    {
      name: 'Curd Rice',
      calories: '290 kcal',
      time: '15 min',
      difficulty: 'Easy',
      ingredients: ['Rice – 1 cup', 'Curd – 1 cup', 'Mustard seeds, ginger – for tempering'],
      instructions: 'Mix rice and curd; add tempered spices on top.',
    },
    {
      name: 'Dal Tadka',
      calories: '310 kcal',
      time: '30 min',
      difficulty: 'Easy',
      ingredients: ['Toor dal – ½ cup', 'Garlic – 3 cloves', 'Cumin, ghee, red chili – for tempering'],
      instructions: 'Cook dal till soft, temper with ghee, garlic, and cumin.',
    },
    {
      name: 'Moong Dal Chilla',
      calories: '200 kcal',
      time: '25 min',
      difficulty: 'Easy',
      ingredients: ['Soaked moong dal – ½ cup', 'Onion, chili – chopped'],
      instructions: 'Grind dal, add veggies, make pancakes on tawa.',
    },
    {
      name: 'Vegetable Upma',
      calories: '280 kcal',
      time: '25 min',
      difficulty: 'Easy',
      ingredients: ['Semolina – 1 cup', 'Mixed veggies – ½ cup', 'Mustard seeds – ½ tsp'],
      instructions: 'Roast rava, sauté veggies, cook with water till thick.',
    },
    {
      name: 'Herbal Green Tea',
      calories: '10 kcal',
      time: '5 min',
      difficulty: 'Easy',
      ingredients: ['Green tea leaves – 1 tsp', 'Mint leaves, honey'],
      instructions: 'Steep green tea with mint; add honey and serve warm.',
    }
  ],
  energetic: [
    {
      name: 'Chole Bhature',
      calories: '450 kcal',
      time: '50 min',
      difficulty: 'Medium',
      ingredients: ['Chickpeas – 1 cup', 'Onion, tomato, ginger-garlic paste – 1 each', 'Maida – 2 cups for bhature'],
      instructions: 'Cook chole with spices; fry bhature till puffed; serve hot.',
    },
    {
      name: 'Masala Oats',
      calories: '250 kcal',
      time: '20 min',
      difficulty: 'Easy',
      ingredients: ['Oats – 1 cup', 'Mixed veggies – ½ cup', 'Spices – as per taste'],
      instructions: 'Cook oats with sautéed veggies and spices in water.',
    },
    {
      name: 'Sprout Salad',
      calories: '180 kcal',
      time: '10 min',
      difficulty: 'Easy',
      ingredients: ['Moong sprouts – 1 cup', 'Tomato, onion – 1 each'],
      instructions: 'Mix all with lemon juice and salt.',
    },
    {
      name: 'Paneer Tikka',
      calories: '300 kcal',
      time: '30 min',
      difficulty: 'Medium',
      ingredients: ['Paneer – 200g', 'Yogurt – 2 tbsp', 'Spices – garam masala, chili powder'],
      instructions: 'Marinate paneer, grill or bake until golden.',
    },
    {
      name: 'Vegetable Pulao',
      calories: '330 kcal',
      time: '30 min',
      difficulty: 'Easy',
      ingredients: ['Rice – 1 cup', 'Mixed vegetables – 1 cup', 'Garam masala – ½ tsp'],
      instructions: 'Sauté spices and veggies, add rice and water, cook till done.',
    },
    {
      name: 'Banana Smoothie',
      calories: '200 kcal',
      time: '5 min',
      difficulty: 'Easy',
      ingredients: ['Banana – 1', 'Milk – 1 cup', 'Oats – 2 tbsp', 'Honey – 1 tsp'],
      instructions: 'Blend all ingredients until smooth; serve chilled.',
    }
  ],
  creative: [
    {
      name: 'Fusion Maggi',
      calories: '270 kcal',
      time: '15 min',
      difficulty: 'Easy',
      ingredients: ['Maggi noodles – 1 pack', 'Veggies – ½ cup', 'Schezwan sauce – 1 tbsp'],
      instructions: 'Cook noodles; toss with sauce and sautéed veggies.',
    },
    {
      name: 'Samosa Chaat',
      calories: '350 kcal',
      time: '20 min',
      difficulty: 'Easy',
      ingredients: ['Samosa – 2', 'Curd – ½ cup', 'Tamarind & mint chutney – as needed', 'Sev – 2 tbsp'],
      instructions: 'Break samosas, top with chutneys, curd, and sev.',
    },
    {
      name: 'Dhokla Sandwich',
      calories: '280 kcal',
      time: '30 min',
      difficulty: 'Medium',
      ingredients: ['Dhokla batter – 2 cups', 'Green chutney – 2 tbsp'],
      instructions: 'Steam one layer, spread chutney, add another layer, steam again.',
    },
    {
      name: 'Paneer Frankie',
      calories: '320 kcal',
      time: '25 min',
      difficulty: 'Easy',
      ingredients: ['Paneer – 100g', 'Tortilla/roti – 1', 'Onion, sauces'],
      instructions: 'Sauté paneer in spices, roll in roti with sauces.',
    },
    {
      name: 'Masala Corn',
      calories: '180 kcal',
      time: '10 min',
      difficulty: 'Easy',
      ingredients: ['Sweet corn – 1 cup', 'Butter – 1 tbsp', 'Lemon juice, chili powder'],
      instructions: 'Mix all and serve warm.',
    },
    {
      name: 'Fruit Chaat',
      calories: '160 kcal',
      time: '10 min',
      difficulty: 'Easy',
      ingredients: ['Chopped fruits – 2 cups', 'Chaat masala – ½ tsp', 'Lemon juice – 1 tbsp'],
      instructions: 'Combine fruits, sprinkle masala and lemon juice, mix gently.',
    }
  ],
  stressed: [
    {
      name: 'Kadhi Chawal',
      calories: '330 kcal',
      time: '40 min',
      difficulty: 'Medium',
      ingredients: ['Curd – 1 cup', 'Besan – 2 tbsp', 'Rice – 1 cup', 'Spices – turmeric, cumin'],
      instructions: 'Whisk curd with besan, cook with spices; serve over steamed rice.',
    },
    {
      name: 'Masala Dalia',
      calories: '250 kcal',
      time: '25 min',
      difficulty: 'Easy',
      ingredients: ['Broken wheat – ½ cup', 'Vegetables – ½ cup'],
      instructions: 'Roast dalia, cook with vegetables, salt, and water in pressure cooker.',
    },
    {
      name: 'Besan Ladoo',
      calories: '280 kcal',
      time: '30 min',
      difficulty: 'Easy',
      ingredients: ['Gram flour – 1 cup', 'Ghee – ½ cup', 'Sugar – ½ cup'],
      instructions: 'Roast besan in ghee till aromatic, add sugar, make small balls.',
    },
    {
      name: 'Idli with Sambar',
      calories: '300 kcal',
      time: '40 min',
      difficulty: 'Medium',
      ingredients: ['Idli batter – 2 cups', 'Toor dal – ½ cup', 'Tamarind – 1 tbsp'],
      instructions: 'Steam idlis; cook dal with tamarind and veggies for sambar.',
    },
    {
      name: 'Vegetable Soup',
      calories: '150 kcal',
      time: '20 min',
      difficulty: 'Easy',
      ingredients: ['Carrot, beans, cabbage – 1 cup', 'Garlic – 2 cloves'],
      instructions: 'Boil all veggies, season with salt, pepper, and herbs.',
    },
    {
      name: 'Kheer',
      calories: '320 kcal',
      time: '40 min',
      difficulty: 'Medium',
      ingredients: ['Rice – ¼ cup', 'Milk – 3 cups', 'Sugar – ¼ cup', 'Cardamom – ¼ tsp'],
      instructions: 'Boil milk, add rice, cook till thick; add sugar and nuts',
    }
  ]
};

const SuggestMealsBasedOnMoodInputSchema = z.object({
  mood: z.string().describe('The current mood of the user (e.g., happy, sad, stressed).'),
});
export type SuggestMealsBasedOnMoodInput = z.infer<typeof SuggestMealsBasedOnMoodInputSchema>;

const MealSchema = z.object({
  name: z.string().describe('The name of the meal.'),
  calories: z.string().describe('The calorie count of the meal.'),
  time: z.string().describe('The estimated time to prepare the meal.'),
  difficulty: z.string().describe('The difficulty level of the meal preparation.'),
  ingredients: z.array(z.string()).describe('A list of the ingredients in the meal.'),
  instructions: z.string().describe('Instructions on how to prepare the meal.'),
  image: z.string().describe('URL of the meal image.')
});

const SuggestMealsBasedOnMoodOutputSchema = z.object({
  mealSuggestions: z.array(MealSchema).describe('A list of meal suggestions based on the user\'s mood.'),
});
export type SuggestMealsBasedOnMoodOutput = z.infer<typeof SuggestMealsBasedOnMoodOutputSchema>;

export async function suggestMealsBasedOnMood(input: SuggestMealsBasedOnMoodInput): Promise<SuggestMealsBasedOnMoodOutput> {
  return suggestMealsBasedOnMoodFlow(input);
}

const suggestMealsBasedOnMoodFlow = ai.defineFlow(
  {
    name: 'suggestMealsBasedOnMoodFlow',
    inputSchema: SuggestMealsBasedOnMoodInputSchema,
    outputSchema: SuggestMealsBasedOnMoodOutputSchema,
  },
  async ({ mood }) => {
    const lowerCaseMood = mood.toLowerCase();
    
    let mealsForMood = mealData[lowerCaseMood as keyof typeof mealData];

    if (!mealsForMood) {
      // Fallback for moods that might not be in the list but are in the UI
      if (lowerCaseMood === 'braincircuit') mealsForMood = mealData['stressed'];
      else if (lowerCaseMood === 'frown') mealsForMood = mealData['sad'];
      else if (lowerCaseMood === 'wind') mealsForMood = mealData['calm'];
      else if (lowerCaseMood === 'zap') mealsForMood = mealData['energetic'];
      else if (lowerCaseMood === 'paintbrush') mealsForMood = mealData['creative'];
      else if (lowerCaseMood === 'smile') mealsForMood = mealData['happy'];
      else { // default to happy for unknown moods
        mealsForMood = mealData['happy'];
      }
    }

    const mealSuggestions = mealsForMood.map(meal => ({
        ...meal,
        image: getImageForMeal(meal.name),
    }));

    // Shuffle and pick 6
    const shuffled = mealSuggestions.sort(() => 0.5 - Math.random());
    const finalSuggestions = shuffled.slice(0, 6);

    return { mealSuggestions: finalSuggestions };
  }
);
