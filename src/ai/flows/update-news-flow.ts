/*
 * 
 *  ═══════════════════════════════════════════════════
 *   [USUÁRIO]: Painho_Dev
 *   [DISCORD]: painhodev
 *   [CARGO]: Criador Profissional de Bugs
 *   [HABILIDADES]: Criar bugs novos, Consertar bugs antigos
 *   [STATUS]: Funcionou na minha máquina! 🤷
 *  ═══════════════════════════════════════════════════
 *            \
 *             \     ^__^
 *              \   (oo)\_______
 *                 (__)\       )\/\\
 *                     ||----Ō |
 *                     ||     ||
 * 
 * 
 */
'use server';
/**
 * @fileOverview Flow to update news articles using AI.
 *
 * - updateNews - A function that generates a list of news articles.
 * - UpdateNewsInput - The input type for the updateNews function.
 * - UpdateNewsOutput - The return type for the updateNews function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for a single news item
const NewsItemSchema = z.object({
  title: z.string().describe('The headline of the news article.'),
  source: z.string().describe('The original source of the news (e.g., G1, CNN Brasil).'),
  url: z.string().url().describe('A valid, functional URL to the full article. Should look like a real news URL.'),
});

// Define the input schema for the flow
const UpdateNewsInputSchema = z.object({
  topic: z.string().describe('The central topic for which to generate news articles.'),
});
export type UpdateNewsInput = z.infer<typeof UpdateNewsInputSchema>;

// Define the output schema for the flow
const UpdateNewsOutputSchema = z.object({
  newsItems: z.array(NewsItemSchema).length(4).describe('A list of exactly 4 recent and relevant news articles.'),
});
export type UpdateNewsOutput = z.infer<typeof UpdateNewsOutputSchema>;


/**
 * A wrapper function that invokes the Genkit flow to generate news articles.
 * @param input - The topic for which to generate news.
 * @returns A promise that resolves to an object containing an array of news items.
 */
export async function updateNews(input: UpdateNewsInput): Promise<UpdateNewsOutput> {
  return updateNewsFlow(input);
}


// Define the Genkit prompt for the AI model
const updateNewsPrompt = ai.definePrompt({
  name: 'updateNewsPrompt',
  input: { schema: UpdateNewsInputSchema },
  output: { schema: UpdateNewsOutputSchema },
  prompt: `You are a news curator AI. Your task is to generate a list of 4 recent, realistic-looking news articles about the given topic: {{{topic}}}.

  The articles should be distinct and cover different angles of the story (e.g., human impact, government response, recovery efforts).
  
  For each article, provide a compelling title, a credible source, and a valid-looking but fictional URL. Ensure the final output strictly follows the required JSON schema format.
  Do not include any text outside of the JSON object.
  `,
});

// Define the Genkit flow
const updateNewsFlow = ai.defineFlow(
  {
    name: 'updateNewsFlow',
    inputSchema: UpdateNewsInputSchema,
    outputSchema: UpdateNewsOutputSchema,
  },
  async (input) => {
    const { output } = await updateNewsPrompt(input);
    if (!output) {
        throw new Error("AI did not return a valid output.");
    }
    return output;
  }
);
