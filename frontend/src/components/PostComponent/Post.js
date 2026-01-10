import { FiUser } from 'react-icons/fi';
import Verified from '../Verified'
import PointsMenu from './Menu'
import SocialActions from '../socialAction/SocialActions'
import TextParser from '../textParser'
import { formatTimeAgo } from '../Utils'


const Post = ({posts}) => {
    return <div className="bg-white rounded-xl p-5">
        {posts.map(post => (
            <>
            <div className="flex flex-col gap-4 px-8 py-6" key={post.id}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center font-semibold justify-between gap-5">
                        <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center border border-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <FiUser size={24} />
                        </div>
                        <span className="flex gap-2 items-center">
                            <span className='flex items-center gap-1'>
                                <span className="text-[17px]">{post.author.username}</span>
                                {post.author.info.is_verified ? 
                                    <Verified/>
                                : null}
                            </span>
                            <span className="font-thin text-[13px]">
                                {formatTimeAgo(post.create_date)}
                            </span>
                        </span>
                    </div>
                    <PointsMenu/>
                </div>
                <TextParser>{post.text}</TextParser>
                <SocialActions content={post}/>
            </div>
            <hr/>
            </>
        ))}
    </div>
}

export default Post