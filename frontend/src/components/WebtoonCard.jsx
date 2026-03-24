import { Link } from 'react-router-dom';

const WebtoonCard = ({ webtoon }) => {
  return (
    <Link 
      to={`/webtoon/${webtoon.id}`}
      className="group flex flex-col bg-white dark:bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-lg hover:shadow-[#00dc64]/30 hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-800"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={webtoon.cover_url} 
          alt={webtoon.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {webtoon.genre}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-[#00dc64] font-bold underline">Read Now</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg leading-tight mb-1 text-gray-800 dark:text-white line-clamp-2">{webtoon.title}</h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{webtoon.author}</p>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-500 line-clamp-2">{webtoon.description}</p>
      </div>
    </Link>
  );
};

export default WebtoonCard;
