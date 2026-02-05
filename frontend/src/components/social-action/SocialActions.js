import { useState } from 'react'
import LikeButton from './LikeButton'
import CommentButton from './comments/CommentButton'
import RepostButton from './RepostButton'
import CommentForm from './comments/CommentForm'
import { getUser } from '../utils'


export const buttonClasses = "group flex items-center p-2 rounded-full text-gray-700 " +
                    "transition-colors duration-200 ease-in-out " +
                    "hover:bg-gray-100 active:bg-gray-200 " + 
                    "focus:outline-none focus:ring-0";

export const textClasses = "ml-1 text-sm"


const SocialActions = ({content}) => {
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const user = getUser()
    const handleCommentButton = () => {
        if (user) {
            setIsCommentOpen(!isCommentOpen);
        }
    }

    return <>
        <div className="flex items-center justify-between max-w-[30%] -m-[7px] text-[18px]">
            <LikeButton content={content} user={user}/>
            <div onClick={handleCommentButton} className="cursor-pointer">
                <CommentButton comments={content.comments}/>
            </div>
            <RepostButton/>
        </div>

        {isCommentOpen && (
            <CommentForm user={user}/>
        )}
    </>
}

export default SocialActions;