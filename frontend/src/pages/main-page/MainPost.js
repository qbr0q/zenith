import { useFetch } from '../../hooks/fetch';
import { useSocketHandlers } from '../../hooks/socketHandlers';
import { getUser, socket } from '../../components/utils'
import Post from '../../components/ui/entry-ui/ContentContainer'
import PostPublisher from '../../components/post-component/PostPublisher'
import PostSkeleton from '../../components/ui/PostSkeleton'
import { useQuery } from '@tanstack/react-query';


const MainPost = () => {
    const { executeFetch } = useFetch();
    const user = getUser();
    useSocketHandlers(socket)

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return await executeFetch('get', "posts/");
        },
        // Данные не будут считаться "старыми" 5 минут, пока не прилетит сокет или мы не обновим вручную
        staleTime: 1000 * 60 * 5, 
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <PostSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error.message}</div>;
    }

    return <div>
        {user ? <PostPublisher/> : null}
        <Post contentItems={posts}/>
    </div>
}

export default MainPost