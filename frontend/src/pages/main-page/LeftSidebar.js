import { FiGrid, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useReferenceBook } from '../../hooks/referenceBooks';


const LeftSidebar = () => {
  const { data: topics, isLoading } = useReferenceBook('rbTopic');

  const hashtags = [
    '#javascript', '#webdev', '#reactjs', '#career', '#startup'
  ];

  if (!!isLoading) {return}

  return (
    <div className="flex flex-col gap-7">
      
      {/* Блок 1: Популярные темы */}
      <div className="bg-white rounded-xl p-6 border">
        <div className="flex items-center gap-2 mb-4">
          <FiGrid size={20} className="text-blue-500" />
          <h2 className="font-bold text-lg text-gray-800">Популярные темы</h2>
        </div>
        
        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.code} className="group cursor-pointer">
              <Link
                className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors"
                to={`/search?topic=${topic.slug}`}
              >
                {topic.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Блок 2: Популярные хэштеги */}
      <div className="bg-white rounded-xl p-6 border">
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp size={20} className="text-orange-500" />
          <h2 className="font-bold text-lg text-gray-800">Актуальные хэштеги</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <Link
              to={`/search?query=${encodeURIComponent(tag)}`}
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all border border-transparent hover:border-blue-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;