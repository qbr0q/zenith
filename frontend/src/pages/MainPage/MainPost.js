import { useFetch } from '../../hooks/fetch';
import { useState, useEffect } from 'react';
import { getUser } from '../../components/Utils'
import Post from '../../components/PostComponent/Post'
import PostPublisher from '../../components/PostComponent/postPublisher'


const MainPost = () => {
    const { executeFetch, error, loading } = useFetch();
    const [posts, setPosts] = useState([]);
    const user = getUser()
    
    useEffect(() => {
        const fetchPosts = async () => {
            const url_userId = user ? `?user_id=${user.id}` : ''
            const data = await executeFetch('get', `post/last_posts${url_userId}`);
            setPosts(data);
        };
        
        fetchPosts();
    }, [executeFetch]);

    if (loading) {
        return <div className="text-xl">Загрузка постов...</div>;
    }

    if (error) {
        return <div className="text-red-500">Ошибка: {error}</div>;
    }

    return <div className='bg-white rounded-xl border '>
        {user ? <PostPublisher/> : null}
        <Post posts={posts}/>
    </div>
}

export default MainPost