import PointsMenu from './Menu'
import SocialActions from './socialActions'
import TextParser from '../textParser'


const Post = ({posts}) => {
    return <div className="bg-white rounded-xl p-5" key="0">
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
                <TextParser>{post.text}</TextParser>
                <SocialActions post={post}/>
            </div>
        ))}
    </div>
}

export default Post