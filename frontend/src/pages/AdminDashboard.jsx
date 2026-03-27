import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Edit, Trash2, Image as ImageIcon, Users, BookOpen, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [webtoons, setWebtoons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('webtoons'); // webtoons, users

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/webtoons');
        setWebtoons(res.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this webtoon?')) {
      try {
        await api.delete(`/webtoons/${id}`);
        setWebtoons(webtoons.filter(w => w.id !== id));
      } catch (error) {
        console.error('Error deleting webtoon:', error);
      }
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin h-10 w-10 border-4 border-[#00dc64] border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage webtoons, chapters, and users.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('webtoons')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'webtoons' ? 'bg-[#00dc64] text-white shadow-md shadow-[#00dc64]/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            <BookOpen size={18} /> Webtoons
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'users' ? 'bg-[#00dc64] text-white shadow-md shadow-[#00dc64]/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            <Users size={18} /> Users
          </button>
          <button 
            onClick={() => navigate('/admin/payments')}
            className="px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#00dc64] hover:text-white"
          >
            <DollarSign size={18} /> Payments
          </button>
        </div>
      </div>

      {activeTab === 'webtoons' && (
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold dark:text-white border-l-4 border-[#00dc64] pl-3">Webtoons Management</h2>
            <button className="flex items-center gap-2 bg-[#00dc64] text-white px-4 py-2 text-sm font-bold rounded-full hover:bg-[#00b953] transition shadow-md shadow-[#00dc64]/20">
              <Plus size={16} /> Add New Webtoon
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold rounded-tl-xl w-16">ID</th>
                  <th className="p-4 font-semibold">Cover</th>
                  <th className="p-4 font-semibold">Title & Author</th>
                  <th className="p-4 font-semibold">Genre</th>
                  <th className="p-4 font-semibold text-right rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {webtoons.map(webtoon => (
                  <tr key={webtoon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-4 text-gray-500 font-medium">#{webtoon.id}</td>
                    <td className="p-4">
                      <img src={webtoon.cover_url} alt={webtoon.title} className="w-12 h-16 object-cover rounded shadow-sm" loading="lazy" />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 dark:text-gray-200">{webtoon.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{webtoon.author}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {webtoon.genre}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Add Chapters">
                          <ImageIcon size={18} />
                        </button>
                        <button className="p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(webtoon.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {webtoons.length === 0 && <div className="text-center py-10 text-gray-500">No webtoons found.</div>}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
           <h2 className="text-xl font-bold dark:text-white border-l-4 border-[#00dc64] pl-3 mb-6">User Management</h2>
           
           <UserTable />
        </div>
      )}
    </div>
  );
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This will also remove their comments and favorites.')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
            <th className="p-4 font-semibold rounded-tl-xl w-16">ID</th>
            <th className="p-4 font-semibold">Username</th>
            <th className="p-4 font-semibold">Email</th>
            <th className="p-4 font-semibold">Role</th>
            <th className="p-4 font-semibold text-right rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
              <td className="p-4 text-gray-500 font-medium">#{user.id}</td>
              <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{user.username}</td>
              <td className="p-4 text-gray-500 dark:text-gray-400">{user.email}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4 text-right">
                {user.role !== 'admin' && (
                  <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete User">
                    <Trash2 size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <div className="text-center py-10 text-gray-500">No users found.</div>}
    </div>
  );
};

export default AdminDashboard;
