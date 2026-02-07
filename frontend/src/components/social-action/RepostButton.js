import { FiRepeat } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from './SocialActions'


const Repost = () => {

  const reposts = 0

  return (
    <button className={buttonClasses} onClick={(e) => {e.stopPropagation()}}>
        <FiRepeat />
        <span className={textClasses}>{reposts}</span>
    </button>
  );
}

export default Repost;