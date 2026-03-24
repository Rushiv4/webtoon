import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchMangaDex, getGenreManga, getTrendingManga } from '../services/externalManga';
import { Search, Tag, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

// MangaDex official tag UUIDs for popular genres
const GENRES = [
    { name: 'Action',        id: '391b0423-d847-456f-aff0-8f0cec6cf629' },
    { name: 'Romance',       id: '423e2eae-a7a2-4a8b-ac03-a8351462d71d' },
    { name: 'Fantasy',       id: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc' },
    { name: 'Comedy',        id: '4d32cc48-9f00-4cca-9b5a-a839f0764984' },
    { name: 'Adventure',     id: '87cc87cd-a395-47af-b27a-93258283bbc6' },
    { name: 'Drama',         id: 'b9af3a63-f058-46de-a9a0-e0c13906197a' },
    { name: 'Thriller',      id: '07251805-a27e-4d59-b488-f0bfbec15168' },
    { name: 'Sci-Fi',        id: '256c8bd9-4904-4360-bf4f-508a76d67183' },
    { name: 'Horror',        id: 'cdad7e68-1419-41dd-bdce-27753074a640' },
    { name: 'Mystery',       id: 'ee968100-4191-4968-93d3-f68d863ea48b' },
    { name: 'Slice of Life', id: 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9' },
    { name: 'Sports',        id: '69964a64-2f90-4d33-beeb-f3ed2875eb4c' },
    { name: 'Isekai',        id: 'ace04997-f6bd-436e-b261-779182193d3d' },
    { name: 'Martial Arts',  id: '799c202e-7daa-44eb-9cf7-8a3c0441531e' },
    { name: 'Supernatural',  id: 'eabc5b4c-6aff-42f3-b657-3e90cbd00b75' },
];

const GENRE_COLORS = [
    'from-orange-500 to-red-500','from-pink-500 to-rose-500','from-violet-500 to-purple-500',
    'from-yellow-400 to-orange-400','from-emerald-500 to-teal-500','from-blue-500 to-indigo-500',
    'from-red-600 to-pink-600','from-cyan-500 to-blue-500','from-gray-600 to-gray-800',
    'from-lime-400 to-emerald-500','from-teal-400 to-cyan-400','from-amber-500 to-yellow-400',
    'from-fuchsia-500 to-violet-500','from-orange-600 to-amber-600','from-indigo-500 to-blue-600',
];

/* ─── Hero Slider ───────────────────────────────────────────────── */
const HeroSlider = ({ items }) => {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % items.length);
        }, 4000);
    };

    useEffect(() => {
        if (items.length === 0) return;
        startTimer();
        return () => clearInterval(timerRef.current);
    }, [items.length]);

    const goTo = (idx) => {
        clearInterval(timerRef.current);
        setCurrent(idx);
        startTimer();
    };
    const prev = () => goTo((current - 1 + items.length) % items.length);
    const next = () => goTo((current + 1) % items.length);

    const getCoverUrl = (manga) => {
        const c = manga.relationships?.find(r => r.type === 'cover_art');
        return c?.attributes ? `https://uploads.mangadex.org/covers/${manga.id}/${c.attributes.fileName}` : '';
    };
    const getTitle = (m) => m.attributes?.title?.en || Object.values(m.attributes?.title || {})[0] || '';

    if (items.length === 0) return (
        <div className="w-full h-[480px] md:h-[580px] rounded-[2.5rem] animate-pulse bg-gray-200 dark:bg-gray-800" />
    );

    const slide = items[current];

    return (
        <div className="relative w-full h-[480px] md:h-[580px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
            {/* Background cover — crossfade */}
            {items.map((m, i) => (
                <div key={m.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
                    <img
                        src={getCoverUrl(m)}
                        alt=""
                        className="w-full h-full object-cover scale-105"
                    />
                </div>
            ))}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-end px-8 md:px-16 pb-14 max-w-2xl">
                <div className="mb-4 flex gap-2 flex-wrap">
                    <span className="px-4 py-1.5 bg-[#00dc64] text-white text-xs font-black rounded-full uppercase tracking-widest animate-pulse">
                        🔥 Trending #{current + 1}
                    </span>
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur text-white text-xs font-black rounded-full border border-white/20 capitalize">
                        {slide.attributes?.status}
                    </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                    {getTitle(slide)}
                </h2>
                <p className="text-gray-300 text-sm md:text-base mb-8 line-clamp-2 max-w-lg leading-relaxed">
                    {slide.attributes?.description?.en || Object.values(slide.attributes?.description || {})[0] || 'Discover this trending title in the Global Library.'}
                </p>

                <Link
                    to={`/external-webtoon/${slide.id}`}
                    className="inline-flex items-center gap-3 bg-[#00dc64] hover:bg-[#00b953] text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-[#00dc64]/30 hover:-translate-y-0.5 w-fit text-sm md:text-base"
                >
                    <BookOpen size={20} /> Read Now
                </Link>
            </div>

            {/* Slide dots */}
            <div className="absolute bottom-5 right-8 z-20 flex gap-2">
                {items.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                        className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2.5 bg-[#00dc64]' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
                    />
                ))}
            </div>

            {/* Prev / Next arrows */}
            <button onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 backdrop-blur rounded-full text-white transition opacity-0 group-hover:opacity-100">
                <ChevronLeft size={22} />
            </button>
            <button onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 backdrop-blur rounded-full text-white transition opacity-0 group-hover:opacity-100">
                <ChevronRight size={22} />
            </button>
        </div>
    );
};

/* ─── Main Explore Page ─────────────────────────────────────────── */
const Explore = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeGenre, setActiveGenre] = useState(null);
    const [heroItems, setHeroItems] = useState([]);

    // Load trending for hero
    useEffect(() => {
        getTrendingManga(8).then(d => setHeroItems(d.data || [])).catch(() => {});
    }, []);

    const getCoverUrl = (manga) => {
        const c = manga.relationships?.find(r => r.type === 'cover_art');
        return c?.attributes ? `https://uploads.mangadex.org/covers/${manga.id}/${c.attributes.fileName}.256.jpg` : '';
    };
    const getTitle = (m) => m.attributes?.title?.en || Object.values(m.attributes?.title || {})[0] || 'Unknown';

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setActiveGenre(null);
        setLoading(true);
        try {
            const data = await searchMangaDex(query);
            setResults(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenre = async (genre) => {
        if (activeGenre?.id === genre.id) { setActiveGenre(null); setResults([]); return; }
        setActiveGenre(genre);
        setQuery('');
        setLoading(true);
        try {
            const data = await getGenreManga(genre.id);
            setResults(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const clearFilter = () => { setActiveGenre(null); setResults([]); setQuery(''); };

    return (
        <div className="space-y-10">
            {/* Auto-Sliding Hero */}
            <HeroSlider items={heroItems} />

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSearch} className="relative">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search manga, manhwa, manhua..."
                        className="w-full pl-12 pr-24 py-4 rounded-full bg-white dark:bg-[#1e1e1e] border-2 border-transparent focus:border-[#00dc64] shadow-xl outline-none text-gray-800 dark:text-white transition-all text-base"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00dc64] hover:bg-[#00b953] text-white px-5 py-2.5 rounded-full font-black text-sm transition shadow-lg shadow-[#00dc64]/30">
                        Search
                    </button>
                </form>
            </div>

            {/* Genre Chips */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black dark:text-white flex items-center gap-2">
                        <Tag size={20} className="text-[#00dc64]" /> Browse by Genre
                    </h2>
                    {activeGenre && (
                        <button onClick={clearFilter} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 font-bold transition">
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {GENRES.map((genre, i) => {
                        const isActive = activeGenre?.id === genre.id;
                        return (
                            <button key={genre.id} onClick={() => handleGenre(genre)}
                                className={`px-5 py-2 rounded-full font-black text-sm transition-all duration-200
                                    ${isActive
                                        ? `bg-gradient-to-r ${GENRE_COLORS[i % GENRE_COLORS.length]} text-white shadow-lg scale-105`
                                        : 'bg-white dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#00dc64]/60 hover:text-[#00dc64] shadow-sm'
                                    }`}>
                                {genre.name}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Results Grid */}
            <section>
                {activeGenre && !loading && (
                    <div className="mb-5 flex items-center gap-3">
                        <span className="text-gray-500 font-bold text-sm">Showing:</span>
                        <span className="bg-[#00dc64]/10 text-[#00dc64] px-4 py-1 rounded-full font-black text-sm border border-[#00dc64]/20">{activeGenre.name}</span>
                        <span className="text-gray-400 text-sm">— {results.length} titles</span>
                    </div>
                )}

                {!loading && results.length === 0 && !activeGenre && !query && (
                    <div className="text-center py-20 text-gray-400">
                        <Search size={56} className="mx-auto mb-5 opacity-20" />
                        <p className="font-bold text-lg mb-1">Search or pick a genre to start</p>
                        <p className="text-sm">Thousands of titles awaiting you</p>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {results.map(manga => (
                            <Link to={`/external-webtoon/${manga.id}`} key={manga.id} className="group">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-md group-hover:shadow-[#00dc64]/20 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                                    {getCoverUrl(manga) ? (
                                        <img src={getCoverUrl(manga)} alt={getTitle(manga)}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 text-4xl">📚</div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-full py-2 bg-[#00dc64] text-center text-white rounded-lg font-bold text-xs translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            View Details
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h3 className="font-bold text-sm line-clamp-1 dark:text-white group-hover:text-[#00dc64] transition-colors">{getTitle(manga)}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{manga.attributes?.status} · {manga.attributes?.contentRating}</p>
                                </div>
                            </Link>
                        ))}
                        {results.length === 0 && !loading && (query || activeGenre) && (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <p className="font-bold text-lg">No results found</p>
                                <p className="text-sm mt-1">Try a different search or genre</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Explore;
