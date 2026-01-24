import PostAuthor from './PostAuthor'
import SocialActions from '../socialAction/SocialActions'
// import CommentsPreview from '../socialAction/Comments/CommentsPreview'
import TextParser from '../textParser'


const Post = ({posts}) => {
    return <div className="bg-white rounded-xl p-5">
        {posts.map(post => (<>
            <div className="flex flex-col gap-4 px-8 py-6 whitespace-pre-wrap break-words" key={post.id}>
                <PostAuthor post={post} />
                <TextParser>{post.text}</TextParser>
                <SocialActions content={post}/>
                {/*<CommentsPreview comments={post.comments} postLikesCount={post.like_count}/>*/}
            </div>
            <hr className="-mx-5 border-gray-200"/>
            </>
        ))}
    </div>
}

export default Post