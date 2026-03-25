import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun, Menu, UserCircle, LogOut, Receipt } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-[#121212]/90 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <Menu className="md:hidden w-6 h-6 cursor-pointer text-gray-700 dark:text-gray-300" />
          <Link to="/" className="text-2xl font-black tracking-tighter text-[#00dc64]">
            WEBTOON
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/?genre=Manga" className="font-semibold hover:text-[#00dc64] transition">Manga</Link>
          <Link to="/?genre=Manhwa" className="font-semibold hover:text-[#00dc64] transition">Manhwa</Link>
          <Link to="/?genre=Manhua" className="font-semibold hover:text-[#00dc64] transition">Manhua</Link>
          <Link to="/explore" className="ml-4 px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full font-bold hover:text-[#00dc64] transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Explore
          </Link>
          <Link to="/pricing" className="font-semibold hover:text-[#00dc64] transition">Pricing</Link>

        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-700" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block font-medium dark:text-gray-300 text-gray-700">
                Hi, {user.username}
              </span>
              <Link to="/payment-history" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition" title="Payment History">
                <Receipt size={20} className="text-gray-500 dark:text-gray-400" />
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-bold text-[#00dc64] border border-[#00dc64] px-3 py-1 rounded-full hover:bg-[#00dc64] hover:text-white transition">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="font-semibold hover:text-[#00dc64] transition">Login</Link>
              <Link to="/register" className="bg-[#00dc64] text-white px-4 py-2 font-bold rounded-full hover:bg-[#00b953] transition shadow-lg shadow-[#00dc64]/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
