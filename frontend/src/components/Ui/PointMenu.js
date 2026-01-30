import { useState, useRef, useEffect } from 'react';


function PointMenu({menuItems}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const itemStyle = "flex items-center justify-between px-4 py-2 text-sm " +
                    "text-gray-700 hover:bg-gray-100 hover:text-gray-900 " +
                    "w-full text-left transition duration-150 ease-in-out " +
                    "cursor-pointer"

  // Обработчик для открытия/закрытия меню
  const handleToggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  // Обработчик клика вне меню (для закрытия)
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {                                                                       
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const getItemStyle = (type) => {
    if (type === 'danger') {
      return itemStyle + " text-red-500 fill-current"
    } else {
      return itemStyle
    }
  }

  const getOnClick = (e, btnHandler) => {
    e.preventDefault();
    btnHandler()
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Кнопка "Три точки" */}
      <div>
        <button
          type="button"
          onClick={handleToggleMenu}
          className="group flex items-center justify-center w-8 h-8 rounded-full 
                     text-gray-600 transition duration-200 ease-in-out bg-transparent
                     hover:bg-gray-100 active:bg-gray-200 focus:outline-none" 
          aria-expanded={isOpen}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm12 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
          </svg>
        </button>
      </div>

      <div
        className={`
          origin-top-right absolute right-0 mt-2 w-40 rounded-xl shadow-lg 
          bg-white ring-1 ring-black ring-opacity-5
          transform transition ease-out duration-150 
          ${isOpen 
            ? 'opacity-100 scale-100' // ОТКРЫТО: полная видимость и размер
            : 'opacity-0 scale-95 pointer-events-none' // ЗАКРЫТО: невидимо, немного уменьшено и неактивно для кликов
          }`
        }
        style={{ zIndex: isOpen ? 50 : -1 }}
        role="menu"
      >

        <div className="py-1" role="none">
          {menuItems.map((menuItem, index) => (
            <span
            key={index}
            className={getItemStyle(menuItem.type)}
            role="menuitem"
            onClick={(e) => {getOnClick(e, menuItem.handler)}}
          >
            {menuItem.label}
          </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PointMenu;