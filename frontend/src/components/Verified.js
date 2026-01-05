import { FiCheck } from 'react-icons/fi';


const Verified = () => {
  return (
    <div className="relative group inline-flex items-center">
      <div 
        className="bg-blue-500 flex items-center justify-center w-[18px] h-[18px] transition-transform group-hover:scale-110"
        style={{
          clipPath: "polygon(50% 0%, 61% 10%, 75% 10%, 80% 24%, 94% 28%, 90% 42%, 100% 50%, 90% 58%, 94% 72%, 80% 76%, 75% 90%, 61% 90%, 50% 100%, 39% 90%, 25% 90%, 20% 76%, 6% 72%, 10% 58%, 0% 50%, 10% 42%, 6% 28%, 20% 24%, 25% 10%, 39% 10%)"
        }}
      >
        <FiCheck className="text-white" size={12} strokeWidth={5} />
      </div>

      {/* Тултип */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5
                      px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-[11px] 
                      rounded-lg shadow-xl opacity-0 scale-90 pointer-events-none
                      group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-[-2px]
                      transition-all duration-200 ease-out z-50 whitespace-nowrap">
        Верифицированный аккаунт
        
        {/* Хвостик */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 
                        border-[5px] border-transparent border-t-gray-900/95"></div>
      </div>
    </div>
  );
};

export default Verified