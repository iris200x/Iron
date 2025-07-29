"use client";
import { useState, useEffect } from 'react';

export function ArticleList({ onArticleSelect }: { onArticleSelect: (article: any) => void }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news');
                if (!response.ok) throw new Error("Failed to fetch news.");
                const data = await response.json();
                setArticles(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Today's Health News</h2>
            {loading ? <p>Loading news...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {articles.map((article: any, index) => (
                        <button key={index} onClick={() => onArticleSelect(article)} className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <h3 className="font-bold text-gray-900">{article.title}</h3>
                            <p className="text-sm text-gray-600">{article.source.name}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}