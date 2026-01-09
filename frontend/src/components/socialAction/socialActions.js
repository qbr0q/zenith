import { useState } from 'react'
import Like from './LikeButton'
import Comment from './CommentButton'
import Repost from './RepostButton'
import CommentForm from './CommentForm'
import { getUser } from '../Utils'


export const buttonClasses = "group flex items-center p-2 rounded-full text-gray-700 " +
                    "transition-colors duration-200 ease-in-out " +
                    "hover:bg-gray-100 active:bg-gray-200 " + 
                    "focus:outline-none focus:ring-0";

export const textClasses = "ml-1 text-sm"


const SocialActions = ({content}) => {
    const [isCommentOpen, setIsCommentOpen] = useState(false);

    const user = getUser()
    return <>
        <div className="flex items-center justify-between max-w-[30%] -m-[7px] text-[18px]">
            <Like content={content} user={user}/>
            <div onClick={() => {setIsCommentOpen(true)}} className="cursor-pointer">
                <Comment/>
            </div>
            <Repost/>
        </div>

        {isCommentOpen && (
            <CommentForm setIsCommentOpen={setIsCommentOpen}/>
        )}
    </>
}

export default SocialActions;