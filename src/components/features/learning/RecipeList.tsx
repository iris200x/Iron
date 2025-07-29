"use client";
import { useState, useEffect } from 'react';

export function RecipeList({ onRecipeSelect }: { onRecipeSelect: (recipe: any) => void }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/api/recipes');
                if (!response.ok) throw new Error("Failed to fetch recipes.");
                const data = await response.json();
                setRecipes(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    return (
        <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Healthy Recipes</h2>
            {loading ? <p>Loading recipes...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {recipes.length > 0 ? recipes.map((recipe: any) => (
                        <button key={recipe.id} onClick={() => onRecipeSelect(recipe)} className="w-full text-left p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                            <h3 className="font-bold text-gray-900">{recipe.title}</h3>
                        </button>
                    )) : <p className="text-center text-gray-500">No recipes found.</p>}
                </div>
            )}
        </div>
    );
}