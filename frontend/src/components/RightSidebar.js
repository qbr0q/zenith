import { FiUser, FiPlusSquare  } from 'react-icons/fi';

const PopularPeople = () => {
  const users = [
    { id: 1, name: 'Дмитрий Иванов', username: '@dima_dev', bio: 'Frontend Developer' },
    { id: 2, name: 'Анна Смирнова', username: '@anya_design', bio: 'UI/UX Designer' },
    { id: 3, name: 'Алексей Петров', username: '@alexe_p', bio: 'Backend Guru' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border shadow-sm">
      {/* Заголовок блока */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-lg text-gray-800">Кого почитать</h2>
        <button className="text-xs text-blue-500 font-semibold hover:underline">
          Все
        </button>
      </div>

      {/* Список пользователей */}
      <div className="space-y-5">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              {/* Дефолтная аватарка */}
              <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center border border-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <FiUser size={24} />
              </div>

              {/* Информация о пользователе */}
              <div className="flex flex-col">
                <span className="font-bold text-[15px] text-gray-800 leading-tight group-hover:underline">
                  {user.name}
                </span>
                <span className="text-sm text-gray-500">{user.username}</span>
              </div>
            </div>

            {/* Кнопка подписки */}
            <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all active:scale-95 shadow-md shadow-blue-500/20">
              <FiPlusSquare  size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPeople;