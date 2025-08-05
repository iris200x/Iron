
export function ContentCard({ item, onSelect }: { item: any; onSelect: () => void }) {
  const isRecipe = item.type === 'recipe';
  const publishedDate = new Date(item.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-40 w-full">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover bg-gray-200"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/no_image.png'; }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isRecipe ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {isRecipe ? 'Recipe' : 'Article'}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 leading-snug">{item.title}</h3>
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>{item.sourceName}</span>
          <span>{publishedDate}</span>
        </div>
      </div>
    </button>
  );
}