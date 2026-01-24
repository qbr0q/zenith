import { FiMessageCircle } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from '../SocialActions'


const Comment = ({content}) => {

  const comments = content.comments

  return <>
    <button className={buttonClasses}>
        <FiMessageCircle />
        <span className={textClasses}>{comments.length}</span>
    </button>
  </>
}

export default Comment;