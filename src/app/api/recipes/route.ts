import { NextResponse } from 'next/server';

export async function GET() {
    const API_KEY = process.env.SPOONACULAR_API_KEY;
    const URL = `https://api.spoonacular.com/recipes/random?number=10&tags=vegetarian,healthy&apiKey=${API_KEY}`;

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Spoonacular API request failed: ${response.statusText}`);
        }
        const data = await response.json();
        const cleanedData = data.recipes.map((recipe: any) => ({
            ...recipe,
            summary: recipe.summary.replace(/<[^>]*>?/gm, '')
        }));
        return NextResponse.json(cleanedData);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}