import { FiSettings, FiShield, FiBarChart2, FiBookmark, FiEdit3, FiTool } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getUser } from '../../components/utils'


export const ControlPanel = () => {
  // Список кнопок (легко расширять)
  const menuItems = [
    { name: 'Мои черновики', icon: <FiEdit3 size={18} />, action: () => console.log('Drafts') },
    { name: 'Закладки', icon: <FiBookmark size={18} />, action: () => console.log('Bookmarks') },
    { name: 'Статистика', icon: <FiBarChart2 size={18} />, action: () => console.log('Stats') },
    { name: 'Настройки', icon: <FiSettings size={18} />, action: () => console.log('Settings') },
  ];
  const user = getUser();
  const isAdmin = user?.role === "admin"
  debugger

  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex items-center gap-2 mb-4">
          <FiTool size={20} className="text-blue-500" />
          <h2 className="font-bold text-lg text-gray-800">Панель управления</h2>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all text-sm font-medium"
          >
            {item.icon}
            {item.name}
          </button>
        ))}

        {/* Админка — показываем только если юзер админ */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm font-bold"
                to='dashboard'
                replace
            >
              <FiShield size={18} />
              Администрирование
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;