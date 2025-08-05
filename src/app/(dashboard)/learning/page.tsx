"use client";

import { useState } from 'react';
import { ContentFeed } from '@/components/features/learning/ContentFeed';
import { ContentModal } from '@/components/features/learning/ContentModal';

export default function LearningPage() {
	const [modalContent, setModalContent] = useState<any>(null);

	const handleContentSelect = (item: any) => setModalContent({ type: item.type, data: item.data });

	return (
		<div className="flex flex-col">
			<h1 className="mb-8 text-5xl font-bold text-gray-800">Learning Center</h1>

			<ContentFeed onContentSelect={handleContentSelect} />

			{modalContent && <ContentModal content={modalContent} onClose={() => setModalContent(null)} />}
		</div>
	);
}