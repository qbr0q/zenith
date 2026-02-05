import { useFetch } from '../../hooks/fetch';
import { useSocketHandlers } from '../../hooks/socketHandlers';
import { getUser, socket } from '../../components/utils'
import Post from '../../components/ui/entry-ui/ContentContainer'
import PostPublisher from '../../components/post-component/PostPublisher'
import { useQuery } from '@tanstack/react-query';


const MainPost = () => {
    const { executeFetch } = useFetch();
    const user = getUser();
    useSocketHandlers(socket)

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const url_userId = user ? `?user_id=${user.id}` : '';
            return await executeFetch('get', `post/last_posts${url_userId}`);
        },
        // Данные не будут считаться "старыми" 5 минут, пока не прилетит сокет или мы не обновим вручную
        staleTime: 1000 * 60 * 5, 
    });

    if (isLoading) {
        return <div className="text-xl">Загрузка постов...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error.message}</div>;
    }

    return <div className='bg-white rounded-xl border'>
        {user ? <PostPublisher/> : null}
        <Post contentItems={posts}/>
    </div>
}

export default MainPost