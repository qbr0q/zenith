import { useEffect } from 'react';
import { useFetch } from '../../hooks/fetch';
import { getUser, socket } from '../../components/Utils'
import Post from '../../components/PostComponent/Post'
import PostPublisher from '../../components/PostComponent/postPublisher'
import { useQueryClient, useQuery } from '@tanstack/react-query';


const MainPost = () => {
    const { executeFetch } = useFetch();
    const user = getUser();
    const queryClient = useQueryClient();

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts', user?.id], 
        queryFn: async () => {
            const url_userId = user ? `?user_id=${user.id}` : '';
            return await executeFetch('get', `post/last_posts${url_userId}`);
        },
        // Данные не будут считаться "старыми" 5 минут, пока не прилетит сокет или мы не обновим вручную
        staleTime: 1000 * 60 * 5, 
    });

    // слушаем обновления по сокету
    useEffect(() => {
        socket.on("new_post", (newPost) => {
            // Как только бек прислал пост, обновляем локальный кэш
            queryClient.setQueryData(['posts', user?.id], (oldPosts) => {
                return oldPosts ? [newPost, ...oldPosts] : [newPost];
            });
        });

        return () => socket.off("new_post");
    }, [queryClient, user?.id]);

    if (isLoading) {
        return <div className="text-xl">Загрузка постов...</div>;
    }

    if (error) {
        return <div className="text-red-500">Ошибка: {error.message}</div>;
    }

    return <div className='bg-white rounded-xl border '>
        {user ? <PostPublisher/> : null}
        <Post posts={posts}/>
    </div>
}

export default MainPost