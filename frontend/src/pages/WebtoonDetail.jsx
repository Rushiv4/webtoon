import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Heart, List } from 'lucide-react';

const WebtoonDetail = () => {
  const { id } = useParams();
  const [webtoon, setWebtoon] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [webtoonRes, chapterRes] = await Promise.all([
          api.get(`/webtoons/${id}`),
          api.get(`/chapters/webtoon/${id}`)
        ]);
        setWebtoon(webtoonRes.data);
        setChapters(chapterRes.data);
        
        if (user) {
          const favRes = await api.get('/users/favorites');
          setIsFavorite(favRes.data.some(fav => fav.id === parseInt(id)));
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) return alert("Please login to favorite webtoons");
    setFavLoading(true);
    try {
      const res = await api.post('/users/favorites', { webtoonId: id });
      setIsFavorite(res.data.status === 'added');
    } catch (error) {
      console.error(error);
      alert('Failed to update library');
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin h-10 w-10 border-4 border-[#00dc64] border-t-transparent rounded-full" /></div>;
  if (!webtoon) return <div className="text-center p-20 text-xl font-bold">Webtoon not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-[#1e1e1e] p-6 lg:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img src={webtoon.cover_url} alt={webtoon.title} className="w-full rounded-2xl shadow-lg border-2 border-transparent dark:border-gray-700" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="bg-[#00dc64]/10 text-[#00dc64] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                {webtoon.genre}
              </span>
              <button 
                onClick={toggleFavorite}
                disabled={favLoading}
                className={`p-3 rounded-full transition duration-300 ${isFavorite ? 'bg-red-50 dark:bg-red-900/20 text-red-500 shadow-md scale-110' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500'} ${favLoading ? 'opacity-50 cursor-wait' : ''}`}
              >
                <Heart size={24} className={isFavorite ? "fill-current" : ""} />
              </button>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-2 dark:text-white leading-tight">{webtoon.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-6">By {webtoon.author}</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">{webtoon.description}</p>
          </div>
          
          <div className="mt-8">
            {chapters.length > 0 ? (
              <Link to={`/webtoon/${id}/chapter/${chapters[0].chapter_no}`} className="inline-block bg-[#00dc64] hover:bg-[#00b953] text-white font-bold text-lg px-8 py-4 rounded-full transition shadow-lg shadow-[#00dc64]/30">
                Read Chapter 1
              </Link>
            ) : (
              <button disabled className="bg-gray-300 dark:bg-gray-700 text-gray-500 font-bold px-8 py-4 rounded-full cursor-not-allowed">
                No Chapters Yet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-white dark:bg-[#1e1e1e] p-6 lg:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">
          <List className="text-[#00dc64]" /> Chapter List
        </h2>
        <div className="space-y-3">
          {chapters.length > 0 ? chapters.map(chapter => (
            <Link 
              key={chapter.id} 
              to={`/webtoon/${id}/chapter/${chapter.chapter_no}`}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group"
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-gray-400 group-hover:text-[#00dc64] transition">#{chapter.chapter_no}</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{chapter.title}</span>
              </div>
              <span className="text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full group-hover:bg-[#00dc64]/10 group-hover:text-[#00dc64] transition">
                {new Date(chapter.created_at).toLocaleDateString()}
              </span>
            </Link>
          )) : (
            <p className="text-gray-500 text-center py-10">No chapters uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebtoonDetail;
