import PointsMenu from './Menu'
import SocialActions from './socialActions'
import { useFetch } from '../../hooks/fetch';
import { useState, useEffect } from 'react';

const Post = () => {
    const { executeFetch, error, loading } = useFetch();
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        const fetchPosts = async () => {
            const data = await executeFetch('get', 'post/last_posts');
            setPosts(data);
        };
        
        fetchPosts();
    }, [executeFetch]);

    if (loading) {
        return <div className="text-xl">Загрузка постов...</div>;
    }

    if (error) {
        return <div className="text-red-500">Ошибка: {error.message}</div>;
    }

    return <div className="bg-white  rounded-xl p-6 border" key="0">
        {posts.map(post => (
            <div className="flex flex-col gap-4 p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center font-semibold justify-between gap-5">
                        <img alt='аватарка'
                        src="https://loudouncslcenter.com/wp-content/uploads/default-avatar-icon-of-social-media-user-vector.jpg"
                        className="rounded-full h-[40px]"></img>
                        <span className="flex gap-3 items-center">
                            <span className="text-[17px]">{post.author.username}</span>
                            <span className="font-thin text-[13px]">20ч</span>
                        </span>
                    </div>
                    <PointsMenu/>
                </div>
                <span>{post.text}</span>
                <SocialActions post={post}/>
            </div>
        ))}
    </div>
}

export default Post