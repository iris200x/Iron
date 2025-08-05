import { NextResponse } from 'next/server';

interface ContentItem {
    id: string;
    type: 'article' | 'recipe';
    title: string;
    imageUrl: string;
    sourceName: string;
    url: string;
    publishedAt: string;
    data: any;
}

async function fetchNews(apiKey: string): Promise<ContentItem[]> {
  const URL = `https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=${apiKey}`;

    const response = await fetch(URL);
    if (!response.ok) return [];
    const data = await response.json();

    return data.articles.map((article: any) => ({
        id: article.url,
        type: 'article',
        title: article.title,
        imageUrl: article.urlToImage || '/images/no_image.png',
        sourceName: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        data: article,
    }));
}

async function fetchRecipes(apiKey: string): Promise<ContentItem[]> {
    const URL = `https://api.spoonacular.com/recipes/random?number=10&tags=vegetarian,healthy&apiKey=${apiKey}`;
    const response = await fetch(URL);
    if (!response.ok) return [];
    const data = await response.json();

    return data.recipes.map((recipe: any) => ({
        id: recipe.id.toString(),
        type: 'recipe',
        title: recipe.title,
        imageUrl: recipe.image || '/images/no_image.png',
        sourceName: recipe.sourceName || 'Spoonacular',
        url: recipe.sourceUrl,
        publishedAt: new Date().toISOString(), 
        data: { ...recipe, summary: recipe.summary.replace(/<[^>]*>?/gm, '') },
    }));
}

export async function GET() {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

    if (!NEWS_API_KEY || !SPOONACULAR_API_KEY) {
        return NextResponse.json({ error: "API keys are not configured." }, { status: 500 });
    }

    try {
        const [articles, recipes] = await Promise.all([
            fetchNews(NEWS_API_KEY),
            fetchRecipes(SPOONACULAR_API_KEY),
        ]);

        const combinedFeed = [...articles, ...recipes].sort(
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        return NextResponse.json(combinedFeed);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}