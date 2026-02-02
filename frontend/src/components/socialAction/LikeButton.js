import { useState } from 'react';
import { useFetch } from '../../hooks/fetch';
import { useLoginForm } from '../../hooks/forms'
import { FiHeart } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from './SocialActions'
import { useQueryClient } from '@tanstack/react-query';


const Like = ({content, user}) => {
    const { executeFetch } = useFetch();
    const openLoginForm = useLoginForm()
    const queryClient = useQueryClient();

    const [isLiked, setIsLiked] = useState(!!(content.likes && !content.likes.is_removed));

    const handleLike = async () => {
        if (!user) {
            openLoginForm()
            return null
        }
        // обновляем кеш для мгновенного ui отклика
        queryClient.setQueryData(['posts'], (oldData) => {
            return oldData.map(post => 
                post.id === content.id 
                ? { ...post, like_count: isLiked ? post.like_count - 1 : post.like_count + 1 }
                : post
            );
        });
        setIsLiked(!isLiked);

        try {
            await executeFetch('post', 'social_action/like', {
                post_id: content?.id,
                is_liked: isLiked
            })
        } catch (err) {
            console.error(err)
        }
    };
  
  return (
      <button className={buttonClasses} onClick={handleLike}>
        <FiHeart className={isLiked ? "text-red-500 fill-current" : ""} />
        <span className={textClasses}>{content.like_count}</span>
      </button>
  );
}

export default Like;