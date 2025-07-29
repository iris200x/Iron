"use client";


type ModalContent = {
    type: 'recipe' | 'article';
    data: any; 
}

interface ContentModalProps {
    content: ModalContent;
    onClose: () => void;
}

export function ContentModal({ content, onClose }: ContentModalProps) {
    const isArticle = content.type === 'article';
    const data = content.data;

    const title = data.title;
    const imageUrl = isArticle ? (data.urlToImage || '/images/no_image.png') : (data.image || '/images/no_image.png');
    const description = isArticle ? data.content : data.summary;
    const sourceUrl = isArticle ? data.url : data.sourceUrl;
    const sourceName = isArticle ? data.source.name : "the original source";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4" onClick={onClose}>
            <div className="relative w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                <h2 className="mb-4 text-3xl font-bold text-gray-800">{title}</h2>
                <img
                    src={imageUrl}
                    alt={title || 'Image'}
                    className="mb-6 h-60 w-full rounded-lg object-cover bg-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/no_image.png'; }}
                />
                <p className="text-gray-700 mb-6 whitespace-pre-wrap max-h-60 overflow-y-auto">{description || "No further details available."}</p>
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-yellow-600 hover:underline">
                    {isArticle ? `Read Full Article at ${sourceName}` : 'View Full Recipe'} &rarr;
                </a>
            </div>
        </div>
    );
}