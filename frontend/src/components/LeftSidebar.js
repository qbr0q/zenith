import { FiGrid, FiTrendingUp } from 'react-icons/fi';

const LeftSidebar = () => {
  const topics = [
    { name: 'Политика', count: '1.2k постов' },
    { name: 'IT и разработка', count: '850 постов' },
    { name: 'Психология', count: '640 постов' },
    { name: 'Дизайн', count: '420 постов' },
  ];

  const hashtags = [
    '#javascript', '#webdev', '#reactjs', '#career', '#startup'
  ];

  return (
    <div className="flex flex-col gap-7 w-80">
      
      {/* Блок 1: Популярные темы */}
      <div className="bg-white rounded-xl p-6 border">
        <div className="flex items-center gap-2 mb-4">
          <FiGrid size={20} className="text-blue-500" />
          <h2 className="font-bold text-lg text-gray-800">Популярные темы</h2>
        </div>
        
        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.name} className="group cursor-pointer">
              <p className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                {topic.name}
              </p>
              <p className="text-sm text-gray-400">{topic.count}</p>
            </div>
          ))}
        </div>
        
        <button className="mt-5 text-sm text-blue-500 font-medium hover:underline">
          Показать еще
        </button>
      </div>

      {/* Блок 2: Популярные хэштеги */}
      <div className="bg-white rounded-xl p-6 border">
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp size={20} className="text-orange-500" />
          <h2 className="font-bold text-lg text-gray-800">Актуальные хэштеги</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all border border-transparent hover:border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LeftSidebar;