import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExternalMangaDetails, getExternalMangaChapters } from '../services/externalManga';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Heart, List, BookOpen, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const ExternalWebtoonDetail = () => {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [mangaRes, chapterRes] = await Promise.all([
                    getExternalMangaDetails(id),
                    getExternalMangaChapters(id)
                ]);

                console.log('[DEBUG] mangaRes:', mangaRes);
                console.log('[DEBUG] mangaRes type:', typeof mangaRes);
                console.log('[DEBUG] mangaRes keys:', mangaRes ? Object.keys(mangaRes) : 'null');

                // getExternalMangaDetails returns response.data (axios unwrapped)
                // That gives us the MangaDex JSON body: { result, response, data: { id, type, attributes, relationships } }
                const mangaObj = mangaRes?.data || null;
                console.log('[DEBUG] mangaObj:', mangaObj?.id, mangaObj?.attributes?.title);
                setManga(mangaObj);

                const rawChapters = chapterRes?.data || [];
                console.log('[DEBUG] chapters count:', rawChapters.length);
                let filtered = rawChapters.filter(ch => ch.attributes.translatedLanguage === 'en');
                if (filtered.length === 0 && rawChapters.length > 0) filtered = rawChapters;
                const sorted = filtered.sort((a, b) => (parseFloat(a.attributes.chapter) || 0) - (parseFloat(b.attributes.chapter) || 0));
                setChapters(sorted);

                // Check favorite status separately so it doesn't break the page
                if (user) {
                    try {
                        const favRes = await api.get(`/users/favorites/external/check/${id}`);
                        setIsFavorite(favRes.data.isFavorite);
                    } catch (e) {
                        console.warn('Favorites check failed:', e.message);
                    }
                }
            } catch (error) {
                console.error('Error fetching external details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const handleFavorite = async () => {
        if (!user) return alert('Please log in to save to your library');
        setFavLoading(true);
        try {
            // Get cover and title for external persistence
            const coverArt = manga?.relationships?.find(r => r.type === 'cover_art');
            const cover = coverArt?.attributes ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}.256.jpg` : '';
            const t = attributes?.title?.en || Object.values(attributes?.title || {})[0] || '';
            
            console.log('[DEBUG] Toggling favorite for:', id);
            const res = await api.post('/users/favorites/external', { 
                externalId: id, 
                title: t, 
                coverUrl: cover 
            });
            
            if (res.data.status) {
                setIsFavorite(res.data.status === 'added');
            } else {
                // Fallback toggle if status missing
                setIsFavorite(!isFavorite);
            }
        } catch (e) {
            console.error('Favorite toggle failed:', e);
            alert('Failed to update library. Please try again.');
        } finally {
            setFavLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin h-12 w-12 border-4 border-[#00dc64] border-t-transparent rounded-full shadow-lg" />
        </div>
    );

    if (!manga) return <div className="text-center p-20 text-xl font-bold dark:text-white">Manga not found in Global Library.</div>;

    const attributes = manga.attributes;
    const title = attributes.title.en || Object.values(attributes.title)[0] || 'Unknown Title';
    const description = attributes.description.en || Object.values(attributes.description)[0] || 'No description available.';
    
    const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
    const coverUrl = coverArt ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes?.fileName}` : '/placeholder-cover.jpg';

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
            <Link to="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#00dc64] font-bold transition">
                <ChevronLeft size={20} /> Back to Explore
            </Link>

            {/* Premium Header Profile */}
            <div className="flex flex-col md:flex-row gap-10 bg-white dark:bg-[#1e1e1e] p-6 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00dc64]/5 rounded-full -mr-32 -mt-32 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
                
                <div className="w-full md:w-80 flex-shrink-0 relative z-10">
                    <img 
                        src={coverUrl} 
                        alt={title} 
                        className="w-full rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 transition-transform duration-500 group-hover:scale-[1.02]" 
                    />
                </div>

                <div className="flex flex-col justify-between flex-1 relative z-10">
                    <div>
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="bg-[#00dc64]/10 text-[#00dc64] px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-[#00dc64]/20">
                                Global Library
                            </span>
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-400 px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-transparent dark:border-gray-700">
                                {attributes.status}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black mb-4 dark:text-white leading-none tracking-tight">
                            {title}
                        </h1>

                        <div className="flex items-center gap-6 mb-8 text-gray-500 dark:text-gray-400 font-bold text-sm">
                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-[#00dc64]" /> Daily Updates</span>
                            <span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-500 fill-current" /> High Rated</span>
                        </div>

                        <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-3xl mb-8">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl text-lg line-clamp-4 font-medium">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        {chapters.length > 0 ? (
                            <Link 
                                to={`/external-webtoon/${id}/chapter/${chapters[0].id}`} 
                                className="inline-flex items-center gap-3 bg-[#00dc64] hover:bg-[#00b953] text-white font-black text-lg px-10 py-5 rounded-2xl transition shadow-xl shadow-[#00dc64]/40 hover:-translate-y-1 active:scale-95"
                            >
                                <BookOpen size={22} /> Start Reading
                            </Link>
                        ) : (
                            <button disabled className="bg-gray-300 dark:bg-gray-700 text-gray-500 font-black px-10 py-5 rounded-2xl cursor-not-allowed">
                                No Chapters available on Global Library
                            </button>
                        )}
                        <button 
                            onClick={handleFavorite}
                            disabled={favLoading}
                            title={user ? (isFavorite ? 'Remove from Library' : 'Add to My Library') : 'Login to save'}
                            className={`p-5 rounded-2xl transition-all duration-300 ${isFavorite ? 'bg-red-50 dark:bg-red-900/20 text-red-500 shadow-lg scale-110' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 shadow-md'} ${favLoading ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            <Heart size={24} className={isFavorite ? 'fill-current' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Chapters List */}
            <div className="bg-white dark:bg-[#1e1e1e] p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-10 border-b border-gray-100 dark:border-gray-800 pb-6">
                    <h2 className="text-3xl font-black flex items-center gap-4 dark:text-white">
                        <List className="text-[#00dc64]" size={32} /> 
                        Chapters
                    </h2>
                    <span className="text-gray-400 font-bold bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full text-sm">
                        {chapters.length} available
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chapters.length > 0 ? chapters.map((chapter) => (
                        <Link 
                            key={chapter.id} 
                            to={`/external-webtoon/${id}/chapter/${chapter.id}`}
                            className="group flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 dark:bg-black/10 hover:bg-[#00dc64]/5 dark:hover:bg-[#00dc64]/10 transition-all duration-300 border border-transparent hover:border-[#00dc64]/30"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-[#1e1e1e] group-hover:bg-[#00dc64] group-hover:text-white transition-colors shadow-sm font-black text-[#00dc64]">
                                    {chapter.attributes.chapter || '0'}
                                </div>
                                <div>
                                    <span className="font-black text-lg text-gray-800 dark:text-gray-200 group-hover:text-[#00dc64] transition-colors">
                                        {chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`}
                                    </span>
                                    <div className="flex gap-2 items-center mt-1">
                                        {chapter.attributes.volume && (
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Vol. {chapter.attributes.volume}</p>
                                        )}
                                        <span className="text-[10px] bg-gray-100 dark:bg-white/5 text-gray-400 px-2 py-0.5 rounded uppercase font-black">
                                            {chapter.attributes.translatedLanguage}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            < ChevronRight className="text-gray-300 group-hover:text-[#00dc64] transition-transform group-hover:translate-x-1" />
                        </Link>
                    )) : (
                        <div className="col-span-full text-center py-20 bg-gray-50/30 dark:bg-black/10 rounded-3xl">
                             <p className="text-gray-500 font-bold text-lg">No hostable chapters were found for this series.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExternalWebtoonDetail;
