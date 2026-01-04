import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
  return (
    <div>
      {/* Контейнер с белым фоном и синим акцентом при фокусе */}
      <div className="relative group bg-white border border-gray-200 rounded-xl 
                      transition-all duration-300 focus-within:border-blue-500 shadow-sm">
        
        {/* Иконка - чисто синяя при активации */}
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <FiSearch 
            className="text-gray-400 group-focus-within:text-blue-600 transition-colors" 
            size={22} 
          />
        </div>
        
        {/* Поле ввода: крупное, с большим количеством "воздуха" */}
        <input
          type="text"
          placeholder="Поиск"
          className="w-full bg-transparent py-5 pl-14 pr-6 
                     text-[19px] text-gray-900 placeholder-gray-400
                     outline-none rounded-2xl
                     focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
    </div>
  );
};

export default SearchBar;