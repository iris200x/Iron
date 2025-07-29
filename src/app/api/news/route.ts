import { NextResponse } from 'next/server';

export async function GET() {
    const API_KEY = process.env.NEWS_API_KEY;
    const URL = `https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=${API_KEY}`;

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`News API request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return NextResponse.json(data.articles);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}