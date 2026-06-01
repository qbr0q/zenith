import { useState } from 'react';
import { FiCheckCircle, FiShield, FiUser, FiAlertOctagon, FiMoreVertical, FiSearch, FiAward } from 'react-icons/fi';

// ПРИМЕР СТРУКТУРЫ ДАННЫХ С БЭКА (DTO)
const initialUsers = [
  { id: 1, name: 'Дмитрий Иванов', username: '@dima_dev', avatar: 'https://i.pravatar.cc/150?u=1', postsCount: 42, role: 'admin', isVerified: true, isBanned: false, reputation: 95 },
  { id: 2, name: 'Анна Смирнова', username: '@anya_design', avatar: 'https://i.pravatar.cc/150?u=2', postsCount: 15, role: 'user', isVerified: false, isBanned: false, reputation: 80 },
  { id: 3, name: 'Алексей Петров', username: '@alexe_p', avatar: 'https://i.pravatar.cc/150?u=3', postsCount: 2, role: 'user', isVerified: false, isBanned: true, reputation: -10 },
];


export const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);

  // ФУНКЦИИ ДЛЯ API (заглушки)
  const toggleBan = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, isBanned: !u.isBanned } : u));
    console.log(`PATCH /admin/users/${id}/status`);
  };

  const toggleVerification = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, isVerified: !u.isVerified } : u));
    console.log(`PATCH /admin/users/${id}/verify`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-800">Управление пользователями</h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none" placeholder="Поиск по юзерам..." />
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-gray-400 bg-gray-50/50">
            <th className="px-6 py-4">Пользователь</th>
            <th className="px-6 py-4">Постов</th>
            <th className="px-6 py-4">Роль</th>
            <th className="px-6 py-4 text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 flex items-center gap-3">
                <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-200" alt="" />
                <div>
                  <div className="font-bold text-sm text-gray-800 flex items-center gap-1">
                    {user.name}
                    {user.isVerified && <FiCheckCircle className="text-blue-500" size={14} />}
                  </div>
                  <div className="text-[12px] text-gray-500">{user.username}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.postsCount}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => toggleVerification(user.id)} className={`p-2 rounded-lg transition-colors ${user.isVerified ? 'text-blue-500' : 'text-gray-300'}`}>
                  <FiCheckCircle size={18} />
                </button>
                <button onClick={() => toggleBan(user.id)} className={`p-2 rounded-lg transition-colors ${user.isBanned ? 'text-red-600' : 'text-gray-300'}`}>
                  <FiAlertOctagon size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FiMoreVertical size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};