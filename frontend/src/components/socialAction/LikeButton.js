import { useState } from 'react';
import { useFetch } from '../../hooks/fetch';
import { useLoginForm } from '../../hooks/forms'
import { FiHeart } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from './socialActions'


const Like = ({user, likeCount, hasLiked}) => {
  const [likes, setLikes] = useState(likeCount); 
  const { executeFetch } = useFetch();
  const openLoginForm = useLoginForm()

  const [isLiked, setIsLiked] = useState(hasLiked);

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
          user_id: user.id,
          post_id: 1,
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