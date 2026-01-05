import { FiRepeat } from 'react-icons/fi'; 
import { buttonClasses, textClasses } from './socialActions'


const Repost = () => {

  const reposts = 0

  return (
    <button className={buttonClasses}>
        <FiRepeat />
        <span className={textClasses}>{reposts}</span>
    </button>
  );
}

export default Repost;