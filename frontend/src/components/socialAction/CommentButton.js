import { FiMessageCircle } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from './SocialActions'


const Comment = () => {

  const comments = 0

  return <>
    <button className={buttonClasses}>
        <FiMessageCircle />
        <span className={textClasses}>{comments}</span>
    </button>
  </>
}

export default Comment;