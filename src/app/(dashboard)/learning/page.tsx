// app/(dashboard)/learning/page.tsx
"use client";

import { useState, useEffect } from 'react';

// --- Data Structures ---
interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
  sourceUrl: string;
}

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  source: {
    name: string;
  };
  content: string;
}

type ModalContent = {
    type: 'recipe' | 'article';
    data: Recipe | Article;
}

export default function LearningPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [loading, setLoading] = useState({ recipes: true, articles: true });
  const [error, setError] = useState({ recipes: '', articles: '' });

  // --- Data Fetching ---
  useEffect(() => {
    // 1. Fetch dynamic recipes from Spoonacular API
    const fetchRecipes = async () => {
      // IMPORTANT: Replace with your own free API key from spoonacular.com
      const API_KEY = '84586ec45d1b43be9f750057294d3002';
      const URL = `https://api.spoonacular.com/recipes/random?number=10&tags=vegetarian,healthy&apiKey=${API_KEY}`;

      // FIX: This 'if' block was causing the error and has been removed.
      // The code will now proceed directly to the API call.

      try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error(`Spoonacular API request failed: ${response.statusText}`);
        
        const data = await response.json();
        const cleanedData = data.recipes.map((recipe: any) => ({
            ...recipe,
            summary: recipe.summary.replace(/<[^>]*>?/gm, '') // Remove HTML tags from summary
        }));
        setRecipes(cleanedData || []);
      } catch (err: any) {
        console.error("Error fetching recipes:", err);
        setError(prev => ({ ...prev, recipes: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, recipes: false }));
      }
    };

    // 2. Fetch dynamic news from News API
    const fetchNews = async () => {
      const API_KEY = '8c0f613cb61b48d9af53d68c5707ef01'; 
      const URL = `https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=${API_KEY}`;

      try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error(`News API request failed: ${response.statusText}`);
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err: any) {
        console.error("Error fetching news:", err);
        setError(prev => ({ ...prev, articles: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, articles: false }));
      }
    };

    fetchRecipes();
    fetchNews();
  }, []);

  // --- UI Rendering ---
  const renderModal = () => {
    if (!modalContent) return null;
    
    const isArticle = modalContent.type === 'article';
    const articleData = isArticle ? modalContent.data as Article : null;
    const recipeData = !isArticle ? modalContent.data as Recipe : null;

    const title = isArticle ? articleData?.title : recipeData?.title;
    const imageUrl = isArticle ? (articleData?.urlToImage || '/images/no_image.jpg') : (recipeData?.image || '/images/no_image.jpg');
    const description = isArticle ? articleData?.content : recipeData?.summary;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4" onClick={() => setModalContent(null)}>
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setModalContent(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
          <h2 className="mb-4 text-3xl font-bold text-gray-800">{title}</h2>
          <img src={imageUrl} alt={title || 'Image'} className="mb-6 h-60 w-full rounded-lg object-cover bg-gray-200" onError={(e) => { (e.target as HTMLImageElement).src = '/images/no_image.jpg'; }}/>
          <p className="text-gray-700 mb-6 whitespace-pre-wrap">{description}</p>
          {isArticle && (
              <a href={articleData?.url} target="_blank" rel="noopener noreferrer" className="font-bold text-yellow-600 hover:underline">
                  Read Full Article at {articleData?.source.name} &rarr;
              </a>
          )}
          {!isArticle && (
              <a href={recipeData?.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-yellow-600 hover:underline">
                  View Full Recipe &rarr;
              </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <h1 className="mb-8 text-5xl font-bold text-gray-800">Learning Center</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: News */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">Today's Health News</h2>
          {loading.articles ? <p>Loading news...</p> : error.articles ? <p className="text-red-500">{error.articles}</p> : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {articles.map((article, index) => (
                <button key={index} onClick={() => setModalContent({ type: 'article', data: article })} className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <h3 className="font-bold text-gray-900">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.source.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Healthy Recipes */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">Healthy Recipes</h2>
          {loading.recipes ? <p>Loading recipes...</p> : error.recipes ? <p className="text-red-500">{error.recipes}</p> : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {recipes.length > 0 ? recipes.map((recipe) => (
                <button key={recipe.id} onClick={() => setModalContent({ type: 'recipe', data: recipe })} className="w-full text-left p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                  <h3 className="font-bold text-gray-900">{recipe.title}</h3>
                </button>
              )) : (
                <p className="text-center text-gray-500">No recipes found.</p>
              )}
            </div>
          )}
        </div>
      </div>
      {renderModal()}
    </div>
  );
}
