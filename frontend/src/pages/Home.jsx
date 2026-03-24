import { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { getTrendingManga } from '../services/externalManga';
import { AuthContext } from '../context/AuthContext';
import WebtoonCard from '../components/WebtoonCard';
import {
  Flame, Compass, ChevronRight, BookOpen, Star,
  ChevronLeft, Zap, Library, TrendingUp, Sparkles, Heart
} from 'lucide-react';

/* ─── Reusable Auto-Slider ──────────────────────────────────────── */
const HeroSlider = ({ items }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length);
    }, 5000);
  };

  useEffect(() => {
    if (!items.length) return;
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  const goTo = (i) => { clearInterval(timerRef.current); setCurrent(i); startTimer(); };
  const prev = () => goTo((current - 1 + items.length) % items.length);
  const next = () => goTo((current + 1) % items.length);

  const getCover = (m) => {
    const c = m.relationships?.find(r => r.type === 'cover_art');
    return c?.attributes ? `https://uploads.mangadex.org/covers/${m.id}/${c.attributes.fileName}` : '';
  };
  const getTitle = (m) => m.attributes?.title?.en || Object.values(m.attributes?.title || {})[0] || '';

  if (!items.length) return (
    <div className="w-full h-[520px] md:h-[620px] rounded-[2.5rem] animate-pulse bg-gray-200 dark:bg-gray-800" />
  );

  const slide = items[current];

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
      {/* Crossfade backgrounds */}
      {items.map((m, i) => (
        <div key={m.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={getCover(m)} alt="" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end px-8 md:px-20 pb-16 max-w-3xl">
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="px-4 py-1.5 bg-[#00dc64] text-white text-xs font-black rounded-full uppercase tracking-widest">
            🔥 Trending #{current + 1}
          </span>
          <span className="px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-black rounded-full capitalize">
            {slide.attributes?.status}
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
          {getTitle(slide)}
        </h2>

        <p className="text-gray-300 text-sm md:text-base mb-10 line-clamp-2 max-w-xl leading-relaxed">
          {slide.attributes?.description?.en
            || Object.values(slide.attributes?.description || {})[0]
            || 'Discover this trending title in the Global Library.'}
        </p>

        <div className="flex gap-4 flex-wrap">
          <Link to={`/external-webtoon/${slide.id}`}
            className="inline-flex items-center gap-2 bg-[#00dc64] hover:bg-[#00b953] text-white font-black px-8 py-4 rounded-2xl transition shadow-xl shadow-[#00dc64]/40 hover:-translate-y-0.5 text-sm md:text-base">
            <BookOpen size={18} /> Read Now
          </Link>
          <Link to="/explore"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 text-white font-black px-8 py-4 rounded-2xl transition text-sm md:text-base">
            Explore More <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 right-8 z-20 flex gap-2 items-center">
        {items.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-[#00dc64]' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`} />
        ))}
      </div>

      {/* Arrow nav */}
      <button onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition">
        <ChevronLeft size={22} />
      </button>
      <button onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition">
        <ChevronRight size={22} />
      </button>
    </div>
  );
};

/* ─── Stats Bar ─────────────────────────────────────────────────── */
const stats = [
  { icon: <Library size={22} className="text-[#00dc64]" />, label: 'Titles Available', value: '50,000+' },
  { icon: <TrendingUp size={22} className="text-orange-400" />, label: 'Daily Updates', value: '10,000+' },
  { icon: <Star size={22} className="text-yellow-400 fill-current" />, label: 'Top Rated', value: '4.8 ★' },
  { icon: <Zap size={22} className="text-blue-400" />, label: 'Languages', value: '30+' },
];

/* ─── Genre Quick Nav ───────────────────────────────────────────── */
const QUICK_GENRES = [
  { name: 'Action',     emoji: '⚔️',  color: 'from-orange-500 to-red-600',     id: '391b0423-d847-456f-aff0-8f0cec6cf629' },
  { name: 'Romance',    emoji: '💕',  color: 'from-pink-500 to-rose-600',      id: '423e2eae-a7a2-4a8b-ac03-a8351462d71d' },
  { name: 'Fantasy',    emoji: '🧙',  color: 'from-violet-500 to-purple-600',  id: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc' },
  { name: 'Comedy',     emoji: '😂',  color: 'from-yellow-400 to-orange-400',  id: '4d32cc48-9f00-4cca-9b5a-a839f0764984' },
  { name: 'Horror',     emoji: '👻',  color: 'from-gray-700 to-gray-900',      id: 'cdad7e68-1419-41dd-bdce-27753074a640' },
  { name: 'Sci-Fi',     emoji: '🚀',  color: 'from-cyan-500 to-blue-600',      id: '256c8bd9-4904-4360-bf4f-508a76d67183' },
  { name: 'Isekai',     emoji: '🌀',  color: 'from-fuchsia-500 to-violet-600', id: 'ace04997-f6bd-436e-b261-779182193d3d' },
  { name: 'Slice of Life', emoji: '☕', color: 'from-teal-400 to-emerald-500', id: 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9' },
];

/* ─── Home Page ─────────────────────────────────────────────────── */
const Home = () => {
  const [webtoons, setWebtoons] = useState([]);
  const [trending, setTrending] = useState([]);
  const [externalFavorites, setExternalFavorites] = useState([]);
  const [internalFavorites, setInternalFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const genreFilter = searchParams.get('genre');
  const searchQuery = searchParams.get('search');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (genreFilter) params.append('genre', genreFilter);
        if (searchQuery) params.append('search', searchQuery);
        const qs = params.toString() ? `?${params.toString()}` : '';
        const { data } = await api.get(`/webtoons${qs}`);
        setWebtoons(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [genreFilter, searchQuery]);

  useEffect(() => {
    getTrendingManga(8).then(d => setTrending(d.data || [])).catch(() => {}).finally(() => setTrendingLoading(false));
  }, []);

  // Load user's library (internal + external)
  useEffect(() => {
    if (!user) { 
      setExternalFavorites([]); 
      setInternalFavorites([]);
      return; 
    }
    
    // External
    api.get('/users/favorites/external')
      .then(res => setExternalFavorites(res.data || []))
      .catch(() => setExternalFavorites([]));

    // Internal
    api.get('/users/favorites')
      .then(res => setInternalFavorites(res.data || []))
      .catch(() => setInternalFavorites([]));
  }, [user]);

  const getCoverUrl = (m) => {
    const c = m.relationships?.find(r => r.type === 'cover_art');
    return c?.attributes ? `https://uploads.mangadex.org/covers/${m.id}/${c.attributes.fileName}.256.jpg` : '';
  };

  const isFiltered = genreFilter || searchQuery;

  return (
    <div className="space-y-16 pb-24">

      {/* ── Auto-Sliding Hero (only on main home, not filtered) ── */}
      {!isFiltered && (
        <HeroSlider items={trending} />
      )}

      {/* ── Stats Bar ── */}
      {!isFiltered && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-4 bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow border border-gray-100 dark:border-gray-800 group hover:border-[#00dc64]/40 transition-all duration-300">
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <div>
                <p className="font-black text-lg dark:text-white leading-none">{s.value}</p>
                <p className="text-xs text-gray-400 font-bold mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Genre Quick Nav ── */}
      {!isFiltered && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-black dark:text-white flex items-center gap-3">
              <span className="p-2 bg-violet-100 dark:bg-violet-950/30 rounded-xl text-violet-500">
                <Sparkles size={26} />
              </span>
              Browse Genres
            </h2>
            <Link to="/explore" className="text-[#00dc64] font-bold text-sm hover:underline flex items-center gap-1">
              All Genres <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {QUICK_GENRES.map(g => (
              <Link key={g.id} to={`/explore`}
                className={`bg-gradient-to-br ${g.color} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 group hover:scale-105 hover:shadow-xl transition-all duration-300 aspect-square`}>
                <span className="text-2xl md:text-3xl">{g.emoji}</span>
                <span className="text-white font-black text-xs text-center leading-tight">{g.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Trending Horizontal Scroll ── */}
      {!isFiltered && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-black dark:text-white flex items-center gap-3">
              <span className="p-2 bg-orange-100 dark:bg-orange-950/30 rounded-xl text-orange-500">
                <Flame size={26} />
              </span>
              Trending Now
            </h2>
            <Link to="/explore" className="text-[#00dc64] font-bold text-sm hover:underline flex items-center gap-1 group">
              Browse All <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-5 pb-4 no-scrollbar snap-x">
            {trendingLoading
              ? [...Array(6)].map((_, i) => <div key={i} className="min-w-[200px] aspect-[3/4] animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl flex-shrink-0" />)
              : trending.map(manga => (
                <Link to={`/external-webtoon/${manga.id}`} key={manga.id}
                  className="min-w-[180px] md:min-w-[200px] flex-shrink-0 group snap-start">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-md group-hover:shadow-[#00dc64]/20 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                    {getCoverUrl(manga) && (
                      <img src={getCoverUrl(manga)} alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white font-bold text-xs">Read Now →</span>
                    </div>
                  </div>
                  <p className="mt-2.5 font-bold text-sm dark:text-white line-clamp-1 group-hover:text-[#00dc64] transition-colors">
                    {manga.attributes?.title?.en || Object.values(manga.attributes?.title || {})[0]}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{manga.attributes?.status}</p>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* ── Your Library / Search Results ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-black dark:text-white flex items-center gap-3">
            <span className="p-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl text-emerald-500">
              <Compass size={26} />
            </span>
            {genreFilter ? `${genreFilter} Collection` : searchQuery ? 'Search Results' : 'Your Library'}
          </h2>
        </div>

        {/* Content Area: Search Results OR Your Library */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            
            {/* 1. Show Search/Genre results if active */}
            {isFiltered ? (
               webtoons.length > 0 ? (
                 webtoons.map(w => <WebtoonCard key={w.id} webtoon={w} />)
               ) : (
                 <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl">
                   <p className="text-gray-500 font-bold text-lg">No results found</p>
                   <p className="text-gray-400 text-sm">Try another search or browse categories</p>
                 </div>
               )
            ) : (
              // 2. Otherwise show Unified Library (Internal + External)
              <>
                {/* Internal Favorites */}
                {internalFavorites.map(fav => (
                  <WebtoonCard key={fav.id} webtoon={fav} />
                ))}

                {/* External Favorites */}
                {externalFavorites.map(fav => (
                  <Link to={`/external-webtoon/${fav.external_id}`} key={fav.external_id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-md group-hover:shadow-[#00dc64]/20 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                      {fav.cover_url ? (
                        <img src={fav.cover_url} alt={fav.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 text-4xl">📚</div>
                      )}
                      
                      <div className="absolute top-2 right-2 p-1.5 bg-red-500/90 rounded-full shadow">
                        <Heart size={12} className="text-white fill-current" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white font-bold text-xs">Continue Reading</span>
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <h3 className="font-bold text-sm dark:text-white line-clamp-1 group-hover:text-[#00dc64] transition-colors">{fav.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Global Library</p>
                    </div>
                  </Link>
                ))}

                {/* Empty Library State */}
                {internalFavorites.length === 0 && externalFavorites.length === 0 && (
                  <div className="col-span-full text-center py-24 bg-gray-50 dark:bg-white/5 rounded-3xl">
                    {user ? (
                      <>
                        <Heart size={56} className="mx-auto mb-5 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 font-bold text-lg mb-2">Your library is empty</p>
                        <p className="text-gray-400 text-sm mb-6">Tap ❤️ on any manga or webtoon to save it here</p>
                        <Link to="/explore"
                          className="inline-flex items-center gap-2 bg-[#00dc64] text-white font-black px-8 py-4 rounded-2xl hover:bg-[#00b953] transition shadow-lg shadow-[#00dc64]/30">
                          Discover Titles <ChevronRight size={18} />
                        </Link>
                      </>
                    ) : (
                      <>
                        <Library size={56} className="mx-auto mb-5 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 font-bold text-lg mb-2">Sign in to see your library</p>
                        <p className="text-gray-400 text-sm mb-6">Log in and like titles to build your personal reading list</p>
                        <Link to="/login"
                          className="inline-flex items-center gap-2 bg-[#00dc64] text-white font-black px-8 py-4 rounded-2xl hover:bg-[#00b953] transition shadow-lg">
                          Sign In <ChevronRight size={18} />
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
