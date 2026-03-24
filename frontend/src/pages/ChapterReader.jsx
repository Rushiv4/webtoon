import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, MessageSquare, Send } from 'lucide-react';

const ChapterReader = () => {
  const { webtoonId, chapterNo } = useParams();
  const [images, setImages] = useState([]);
  const [chapterInfo, setChapterInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchChapterData = async () => {
      window.scrollTo(0, 0);
      setLoading(true);
      try {
        // Find chapter ID by webtoon ID and chapterNo
        const chaptersRes = await api.get(`/chapters/webtoon/${webtoonId}`);
        const currentChapter = chaptersRes.data.find(c => c.chapter_no === parseInt(chapterNo));
        
        if (currentChapter) {
          setChapterInfo({
            ...currentChapter,
            prev: chaptersRes.data.find(c => c.chapter_no === parseInt(chapterNo) - 1),
            next: chaptersRes.data.find(c => c.chapter_no === parseInt(chapterNo) + 1),
          });

          // Fetch images
          const imagesRes = await api.get(`/chapters/${currentChapter.id}/images`);
          setImages(imagesRes.data);

          // Fetch comments
          const commentsRes = await api.get(`/comments/webtoon/${webtoonId}/chapter/${chapterNo}`);
          setComments(commentsRes.data);
        }
      } catch (error) {
        console.error('Error fetching chapter:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChapterData();
  }, [webtoonId, chapterNo]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    try {
      await api.post('/comments', {
        webtoonId,
        chapterNo,
        content: newComment
      });
      setNewComment('');
      // Refresh comments
      const res = await api.get(`/comments/webtoon/${webtoonId}/chapter/${chapterNo}`);
      setComments(res.data);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin h-10 w-10 border-4 border-[#00dc64] border-t-transparent rounded-full" /></div>;
  if (!chapterInfo) return <div className="text-center p-20 text-xl font-bold">Chapter not found.</div>;

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm mb-8 border border-gray-100 dark:border-gray-800 sticky top-20 z-40">
        <Link to={`/webtoon/${webtoonId}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#00dc64] font-semibold transition">
          <ChevronLeft size={20} /> Back
        </Link>
        <h2 className="font-bold text-center flex-1 mx-4 truncate dark:text-white">
          Chapter {chapterInfo.chapter_no}: {chapterInfo.title}
        </h2>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Reader Images */}
      <div className="flex flex-col bg-black/5 rounded-2xl overflow-hidden min-h-screen">
        {images.length > 0 ? images.map((img) => (
          <img 
            key={img.id} 
            src={img.image_url} 
            alt={`Page ${img.sequence_no}`}
            className="w-full object-contain block mx-auto border-b border-black/10 last:border-0"
            loading="lazy"
          />
        )) : (
          <div className="text-center p-20 text-gray-500">No images uploaded for this chapter yet.</div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between mt-8 p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
        {chapterInfo.prev ? (
          <Link to={`/webtoon/${webtoonId}/chapter/${chapterInfo.prev.chapter_no}`} className="flex items-center gap-2 font-bold px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition dark:text-gray-200">
            <ChevronLeft size={20} /> Prev
          </Link>
        ) : <div className="w-28"></div>}
        
        <Link to={`/webtoon/${webtoonId}`} className="font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition">
          List
        </Link>
        
        {chapterInfo.next ? (
          <Link to={`/webtoon/${webtoonId}/chapter/${chapterInfo.next.chapter_no}`} className="flex items-center gap-2 font-bold px-6 py-3 bg-[#00dc64] text-white rounded-full hover:bg-[#00b953] transition shadow-lg shadow-[#00dc64]/20">
            Next <ChevronRight size={20} />
          </Link>
        ) : <div className="w-28 flex justify-end"><span className="text-gray-400 font-bold uppercase tracking-widest text-sm">End</span></div>}
      </div>

      {/* Comments Section */}
      <div className="mt-16 bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 lg:p-10 shadow-xl border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">
          <MessageSquare className="text-[#00dc64]" /> Comments ({comments.length})
        </h3>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-10 relative">
            <textarea
              className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 pr-16 focus:outline-none focus:ring-2 focus:ring-[#00dc64] resize-none dark:text-white text-gray-800"
              rows="3"
              placeholder="What did you think of this chapter?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <button 
              type="submit" 
              className="absolute bottom-4 right-4 p-3 bg-[#00dc64] text-white rounded-full hover:bg-[#00b953] transition shadow-md shadow-[#00dc64]/30"
              disabled={!newComment.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        ) : (
          <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-center border-dashed border-2 border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-3">Please log in to leave a comment.</p>
            <Link to="/login" className="inline-block bg-white dark:bg-[#1e1e1e] font-bold text-[#00dc64] border border-[#00dc64] px-6 py-2 rounded-full hover:bg-[#00dc64] hover:text-white transition">Log In</Link>
          </div>
        )}

        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00dc64] to-[#00b953] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                {comment.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-gray-800 dark:text-gray-200">{comment.username}</span>
                  <span className="text-xs text-gray-400 font-medium">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-center text-gray-500 py-4">Be the first to comment!</p>}
        </div>
      </div>
    </div>
  );
};

export default ChapterReader;
