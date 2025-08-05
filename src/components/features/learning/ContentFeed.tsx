"use client";
import { useState, useEffect } from 'react';
import { ContentCard } from './ContentCard';

export function ContentFeed({ onContentSelect }: { onContentSelect: (content: any) => void }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await fetch('/api/learning-feed');
                if (!response.ok) throw new Error("Failed to fetch the learning feed.");
                const data = await response.json();
                setItems(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    return (
        <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Learning Feed</h2>
            {loading ? <p>Loading feed...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto p-2">
                    {items.map((item: any) => (
                        <ContentCard key={item.id} item={item} onSelect={() => onContentSelect(item)} />
                    ))}
                </div>
            )}
        </div>
    );
}