import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WebtoonDetail from './pages/WebtoonDetail';
import ChapterReader from './pages/ChapterReader';
import AdminDashboard from './pages/AdminDashboard';
import Explore from './pages/Explore';
import ExternalWebtoonDetail from './pages/ExternalWebtoonDetail';
import ExternalChapterReader from './pages/ExternalChapterReader';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import PaymentHistory from './pages/PaymentHistory';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-webtoon-dark text-webtoon-text' : 'bg-webtoon-light-bg text-webtoon-light-text'}`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/webtoon/:id" element={<WebtoonDetail />} />
            <Route path="/webtoon/:webtoonId/chapter/:chapterNo" element={<ChapterReader />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/external-webtoon/:id" element={<ExternalWebtoonDetail />} />
            <Route path="/external-webtoon/:mangaId/chapter/:chapterId" element={<ExternalChapterReader />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/payment-history" element={<PaymentHistory />} />


          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
