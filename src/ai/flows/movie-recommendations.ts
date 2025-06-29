'use server';
/**
 * @fileOverview Movie recommendation AI flow.
 *
 * - recommendMovies - A function that suggests movies based on a search query.
 * - MovieRecsInput - The input type for the recommendMovies function.
 * - MovieRecsOutput - The return type for the recommendMovies function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MovieRecsInputSchema = z.object({
  query: z.string().describe("The user's movie search query."),
  existingTitles: z.array(z.string()).describe('A list of movie titles already found, to avoid duplicates.'),
});
export type MovieRecsInput = z.infer<typeof MovieRecsInputSchema>;

const MovieRecsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('An array of up to 5 recommended movie titles.'),
});
export type MovieRecsOutput = z.infer<typeof MovieRecsOutputSchema>;


export async function recommendMovies(input: MovieRecsInput): Promise<MovieRecsOutput> {
  return recommendMoviesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMoviesPrompt',
  input: { schema: MovieRecsInputSchema },
  output: { schema: MovieRecsOutputSchema },
  prompt: `You are a movie recommendation expert for a streaming service called VibeStream.
A user searched for "{{query}}".
The initial search returned these movies: {{#if existingTitles}}{{#each existingTitles}}'{{this}}'{{#unless @last}}, {{/unless}}{{/each}}{{else}}none{{/if}}.

Suggest up to 5 additional, highly relevant movie titles that the user might enjoy based on their query.
Do not include any movies from the "existingTitles" list in your suggestions.
Return only a JSON object with a "recommendations" key containing an array of the movie titles.`,
});

const recommendMoviesFlow = ai.defineFlow(
  {
    name: 'recommendMoviesFlow',
    inputSchema: MovieRecsInputSchema,
    outputSchema: MovieRecsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
