import { getHotTakeComment} from '../Utils'
import Comment from './Comment'


const CommentsPreview = ({comments, postLikesCount}) => {
    const hotTakeComment = getHotTakeComment(comments, postLikesCount)

    return hotTakeComment && <Comment comment={hotTakeComment}/>
}

export default CommentsPreview