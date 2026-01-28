import { FiMessageCircle } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from '../SocialActions'


const Comment = ({comments}) => {

  return <>
    <button className={buttonClasses}>
        <FiMessageCircle />
        <span className={textClasses}>{comments.length}</span>
    </button>
  </>
}

export default Comment;