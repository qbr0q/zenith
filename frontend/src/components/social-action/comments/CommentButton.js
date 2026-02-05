import { FiMessageCircle } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from '../SocialActions'
import { getCountComments } from '../utils'


const Comment = ({comments}) => {
    const commentCount = getCountComments(comments);

    return <>
        <button className={buttonClasses}>
            <FiMessageCircle />
        <span className={textClasses}>{commentCount}</span>
    </button>
  </>
}

export default Comment;