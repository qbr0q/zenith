import { FiUser, FiCheck } from 'react-icons/fi';
import PointsMenu from './Menu'
import SocialActions from './socialActions'
import TextParser from '../textParser'


const Post = ({posts}) => {
    return <div className="bg-white rounded-xl p-5" key="0">
        {posts.map(post => (
            <div className="flex flex-col gap-4 p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center font-semibold justify-between gap-5">
                        <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center border border-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <FiUser size={24} />
                        </div>
                        <span className="flex gap-2 items-center">
                            <span className='flex items-center gap-2'>
                                <span className="text-[17px]">{post.author.username}</span>
                                {post.author.info.is_verified ? <FiCheck className="text-blue-500"/> : null}
                            </span>
                            <span className="font-thin text-[13px]">20ч</span>
                        </span>
                    </div>
                    <PointsMenu/>
                </div>
                <TextParser>{post.text}</TextParser>
                <SocialActions post={post}/>
            </div>
        ))}
    </div>
}

export default Post