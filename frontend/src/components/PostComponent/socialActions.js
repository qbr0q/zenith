import { useState } from 'react';
import { FiHeart, FiMessageCircle, FiRepeat, FiShare2 } from 'react-icons/fi'; 

function SocialActions({post}) {
  // 1. Инициализация нулей и стейт для лайка
  const [likes, setLikes] = useState(post.like_count); 
  // const [comments, setComments] = useState(0);
  // const [reposts, setReposts] = useState(0);
  // const [shares, setShares] = useState(0);
  const comments = 0
  const reposts = 0
  const shares = 0
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  // Классы для эффекта "кружка"
  const buttonClasses = "group flex items-center p-2 rounded-full text-gray-700 " +
                        "transition-colors duration-200 ease-in-out " +
                        // Фон по умолчанию прозрачный (bg-transparent).
                        "hover:bg-gray-100 active:bg-gray-200 " + 
                        "focus:outline-none focus:ring-0"; // Убираем ring, чтобы не было обводки

  const textClasses = "ml-1 text-sm";

  return (
    <div className="flex items-center justify-between max-w-[40%] -m-[7px] text-[18px]">
      
      {/* Кнопка "Лайк" */}
      <button className={buttonClasses} onClick={handleLike}>
        <FiHeart className={isLiked ? "text-red-500 fill-current" : ""} />
        <span className={textClasses}>{likes}</span>
      </button>

      {/* Кнопка "Комментарий" */}
      <button className={buttonClasses}>
        <FiMessageCircle />
        <span className={textClasses}>{comments}</span>
      </button>

      {/* Кнопка "Репост" */}
      <button className={buttonClasses}>
        <FiRepeat />
        <span className={textClasses}>{reposts}</span>
      </button>

      {/* Кнопка "Поделиться" */}
      <button className={buttonClasses}>
        <FiShare2 />
        <span className={textClasses}>{shares}</span>
      </button>
      
    </div>
  );
}

export default SocialActions;