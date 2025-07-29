"use client";

import { useState } from 'react';
import { ArticleList } from '@/components/features/learning/ArticleList';
import { RecipeList } from '@/components/features/learning/RecipeList';
import { ContentModal } from '@/components/features/learning/ContentModal';

type ModalContent = {
	type: 'recipe' | 'article';
	data: any;
}

export default function LearningPage() {
	const [modalContent, setModalContent] = useState<ModalContent | null>(null);

	const handleArticleSelect = (article: any) => setModalContent({ type: 'article', data: article });
	const handleRecipeSelect = (recipe: any) => setModalContent({ type: 'recipe', data: recipe });

	return (
		<div className="flex flex-col">
			<h1 className="mb-8 text-5xl font-bold text-gray-800">Learning Center</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<ArticleList onArticleSelect={handleArticleSelect} />
				<RecipeList onRecipeSelect={handleRecipeSelect} />
			</div>

			{modalContent && <ContentModal content={modalContent} onClose={() => setModalContent(null)} />}
		</div>
	);
}