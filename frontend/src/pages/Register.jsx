import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { register, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate('/');
    } catch (err) {
      setError('Google sign up failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-black mb-2 text-center text-gray-800 dark:text-white">Join Webtoon</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Create an account to track and favorite webtoons.</p>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Username</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#00dc64]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#00dc64]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#00dc64]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#00dc64] text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-[#00dc64]/30 hover:bg-[#00b953] transition"
          >
            Sign Up
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-[#1e1e1e] text-gray-500">OR</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#121212] text-gray-700 dark:text-white py-3 rounded-xl font-bold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>
        
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-[#00dc64] font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
