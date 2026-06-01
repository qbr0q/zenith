import { FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="group flex items-center gap-2 px-4 py-4 bg-white border border-gray-200
                 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all
                 text-gray-600 hover:text-blue-600 font-medium text-sm"
    >
      <FiHome size={18} />
      <span>На главную</span>
    </button>
  );
};