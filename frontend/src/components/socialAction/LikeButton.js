import { useState } from 'react';
import { useFetch } from '../../hooks/fetch';
import { useLoginForm } from '../../hooks/forms'
import { FiHeart } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from './SocialActions'


const Like = ({content, user}) => {
  const [likes, setLikes] = useState(content.like_count); 
  const { executeFetch } = useFetch();
  const openLoginForm = useLoginForm()

  const [isLiked, setIsLiked] = useState(content.likes && !content.likes.is_removed);

  const handleLike = () => {
      if (!user) {
          openLoginForm()
          return null
      }
      if (isLiked) {
          setLikes(prev => prev - 1);
      } else {
          setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    
    executeFetch('post', 'post/like', {
        user_id: user?.id,
        post_id: content?.id,
        is_liked: isLiked
    })
  };
  
  return (
      <button className={buttonClasses} onClick={handleLike}>
        <FiHeart className={isLiked ? "text-red-500 fill-current" : ""} />
        <span className={textClasses}>{likes}</span>
      </button>
  );
}

export default Like;