import { useState } from 'react'
import LikeButton from './LikeButton'
import CommentButton from './Comments/CommentButton'
import RepostButton from './RepostButton'
import CommentForm from './Comments/CommentForm'
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
            <LikeButton content={content} user={user}/>
            <div onClick={() => {setIsCommentOpen(!isCommentOpen)}} className="cursor-pointer">
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