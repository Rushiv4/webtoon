import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getExternalChapterImages, getExternalMangaChapters } from '../services/externalManga';
import { ChevronLeft, ChevronRight, List, Maximize2, Minimize2, ArrowLeft, ArrowRight } from 'lucide-react';

const ExternalChapterReader = () => {
    const { mangaId, chapterId } = useParams();
    const [images, setImages] = useState([]);
    const [externalUrl, setExternalUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fullWidth, setFullWidth] = useState(true);
    const [chapters, setChapters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const navigate = useNavigate();

    // Fetch the chapter list so we can navigate between chapters
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const res = await getExternalMangaChapters(mangaId);
                // Service returns MangaDex body directly: {result, data: [...chapters]}
                const raw = res?.data || [];
                const filtered = raw
                    .filter(ch => ch.attributes.translatedLanguage === 'en')
                    .sort((a, b) => (parseFloat(a.attributes.chapter) || 0) - (parseFloat(b.attributes.chapter) || 0));
                setChapters(filtered);
                const idx = filtered.findIndex(ch => ch.id === chapterId);
                setCurrentIndex(idx);
            } catch (e) {
                console.error('Failed to load chapter list:', e);
            }
        };
        fetchChapters();
    }, [mangaId, chapterId]);

    // Fetch images for current chapter
    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            setExternalUrl(null);
            try {
                const data = await getExternalChapterImages(chapterId);
                setImages(data.images || []);
                setExternalUrl(data.externalUrl || null);
                window.scrollTo(0, 0);
            } catch (error) {
                console.error('Error fetching chapter images:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, [chapterId]);

    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextChapter = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
    const currentChapterNum = chapters[currentIndex]?.attributes?.chapter;

    const goToChapter = (ch) => {
        navigate(`/external-webtoon/${mangaId}/chapter/${ch.id}`);
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[80vh] gap-4">
            <div className="animate-spin h-12 w-12 border-4 border-[#00dc64] border-t-transparent rounded-full" />
            <p className="text-gray-500 font-bold animate-pulse">Loading pages...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black/95 text-white -mt-8 -mx-4 pb-20 overflow-x-hidden">
            {/* Control Bar */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(`/external-webtoon/${mangaId}`)}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="font-black text-sm md:text-base leading-none">
                            {currentChapterNum ? `Chapter ${currentChapterNum}` : 'Reading'}
                        </h2>
                        <p className="text-[10px] text-[#00dc64] uppercase font-black mt-0.5">Global Reader</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Prev / Next in top bar */}
                    <button
                        onClick={() => prevChapter && goToChapter(prevChapter)}
                        disabled={!prevChapter}
                        className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${prevChapter ? 'bg-white/5 hover:bg-white/10 border-white/10 cursor-pointer' : 'opacity-30 border-white/5 cursor-not-allowed'}`}
                    >
                        <ArrowLeft size={14} /> Prev
                    </button>
                    <button
                        onClick={() => nextChapter && goToChapter(nextChapter)}
                        disabled={!nextChapter}
                        className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${nextChapter ? 'bg-[#00dc64] hover:bg-[#00b953] border-[#00dc64] cursor-pointer' : 'opacity-30 border-white/5 cursor-not-allowed'}`}
                    >
                        Next <ArrowRight size={14} />
                    </button>
                    <button 
                        onClick={() => setFullWidth(!fullWidth)}
                        className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition text-xs font-bold border border-white/10"
                    >
                        {fullWidth ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        {fullWidth ? 'Contain' : 'Full'}
                    </button>
                    <Link 
                        to={`/external-webtoon/${mangaId}`}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-white/10"
                    >
                        <List size={14} /> All Chapters
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className={`mx-auto transition-all duration-500 ${fullWidth ? 'max-w-none' : 'max-w-4xl px-4'}`}>
                <div className="flex flex-col items-center">
                    {images.length > 0 ? images.map((src, index) => (
                        <div key={index} className="relative w-full overflow-hidden">
                            <img 
                                src={src} 
                                alt={`Page ${index + 1}`} 
                                className="w-full h-auto block"
                                loading={index < 3 ? "eager" : "lazy"}
                            />
                        </div>
                    )) : (
                        <div className="py-40 text-center px-6">
                             <div className="inline-flex items-center justify-center p-6 bg-white/5 rounded-full mb-8">
                                <Maximize2 size={48} className="text-[#00dc64]" />
                             </div>
                             <h2 className="text-3xl font-black mb-4">External Content</h2>
                             <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
                                {externalUrl 
                                    ? "This chapter is hosted on an external official provider and can't be displayed directly here due to security policies."
                                    : "This chapter's images are hosted on a secure external provider and can't be displayed inline."}
                             </p>
                             
                             <div className="flex flex-col md:flex-row justify-center gap-4">
                                {externalUrl && (
                                    <a 
                                        href={externalUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-12 py-4 bg-[#00dc64] hover:bg-[#00b953] text-white rounded-2xl font-black transition flex items-center justify-center gap-2"
                                    >
                                        Open on Original Site <ArrowRight size={20} />
                                    </a>
                                )}
                                <button 
                                    onClick={() => navigate(`/external-webtoon/${mangaId}`)}
                                    className="px-12 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black transition"
                                >
                                    Back to Details
                                </button>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Navigation */}
            {images.length > 0 && (
                <div className="max-w-2xl mx-auto mt-16 px-4 text-center">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                        <h3 className="text-xl font-black mb-2">Chapter {currentChapterNum} Complete!</h3>
                        <p className="text-gray-400 text-sm mb-8">
                            {nextChapter 
                                ? `Up next: Chapter ${nextChapter.attributes.chapter}` 
                                : "You're all caught up on this series!"}
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            {prevChapter && (
                                <button 
                                    onClick={() => goToChapter(prevChapter)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition"
                                >
                                    <ArrowLeft size={18} /> Ch. {prevChapter.attributes.chapter}
                                </button>
                            )}
                            <button 
                                onClick={() => navigate(`/external-webtoon/${mangaId}`)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition border border-white/10"
                            >
                                Chapter List
                            </button>
                            {nextChapter ? (
                                <button 
                                    onClick={() => goToChapter(nextChapter)}
                                    className="flex items-center gap-2 px-8 py-3 bg-[#00dc64] hover:bg-[#00b953] text-white font-black rounded-2xl transition shadow-lg shadow-[#00dc64]/30 hover:-translate-y-0.5"
                                >
                                    Ch. {nextChapter.attributes.chapter} <ArrowRight size={18} />
                                </button>
                            ) : (
                                <Link 
                                    to="/explore"
                                    className="px-8 py-3 bg-[#00dc64] hover:bg-[#00b953] text-white font-black rounded-2xl transition"
                                >
                                    Find More
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExternalChapterReader;
