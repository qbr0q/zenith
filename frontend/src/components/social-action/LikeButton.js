import { useState } from 'react';
import { useFetch } from '../../hooks/fetch';
import { useLoginForm } from '../../hooks/forms'
import { FiHeart } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from './SocialActions';
import {updateCommentLikes, updatePostLikes } from './utils';
import { useQueryClient } from '@tanstack/react-query';


const Like = ({content, user}) => {
    const { executeFetch } = useFetch();
    const openLoginForm = useLoginForm()
    const [isLiked, setIsLiked] = useState(content.is_liked);
    const queryClient = useQueryClient();

    const updateCacheMap = {
        post: updatePostLikes,
        comment: updateCommentLikes
    }

    const handleLike = async () => {
        if (!user) {
            openLoginForm()
            return null
        }
        // обновляем кеш для мгновенного ui отклика
        const updateHandler = updateCacheMap[content.type]
        await updateHandler(queryClient, content, isLiked)
        setIsLiked(!isLiked);

        try {
            await executeFetch('post', 'social_action/like', {
                post_id: content?.id,
                type: content.type
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