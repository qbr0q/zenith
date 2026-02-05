import { FiSearch } from 'react-icons/fi';
import { useCallback, useEffect, useRef } from 'react';

const SearchBar = () => {

  const searchInputRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
          e.preventDefault();
          searchInputRef.current?.blur();
        }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
  }, [handleKeyDown])

  return (
    <div>
      {/* Контейнер с белым фоном и синим акцентом при фокусе */}
      <div className="relative group bg-white border border-gray-200 rounded-xl 
                      transition-all duration-300 focus-within:border-blue-500 shadow-sm">
        
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <FiSearch 
            className="text-gray-400 group-focus-within:text-blue-600 transition-colors" 
            size={22} 
          />
        </div>
        
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Поиск"
          className="w-full bg-transparent py-5 pl-14 pr-6 
                     text-[19px] text-gray-900 placeholder-gray-400
                     outline-none rounded-2xl
                     focus:ring-blue-100 transition-all"
        />
      </div>
    </div>
  );
};

export default SearchBar;