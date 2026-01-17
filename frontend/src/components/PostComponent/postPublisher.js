import { useState, useRef, useEffect, useCallback } from 'react';
import { useFetch } from '../../hooks/fetch';
import { getUser } from '../Utils'

const PostPublisher = () => {
    const [postText, setPostText] = useState('');
    const [postLength, setPostLength] = useState(0);
    const textareaRef = useRef(null);
    const postPushBtn = useRef(null);
    const { executeFetch } = useFetch();

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [postText]);

    const isButtonEnabled = postText.trim().length > 0;

    const handlePostSubmit = () => {
        if (isButtonEnabled) {
            const user = getUser()
            executeFetch('post', 'post/create_post', {
                post_content: postText,
                user_id: user.id
            })
            setPostText('');
        }
    };

    const handlePostChange = (e) => {
        const newValue = e.target.value;
        setPostText(newValue)
        setPostLength(newValue.length)
    }

    const sendPost = () => {
        postPushBtn.current?.click()
    }

    const handleKeyDown = useCallback((e) => {
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            sendPost()
            setPostLength(0)
    }}, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
    }, [handleKeyDown])

    return (
        <div className="flex flex-col min-w-0 bg-white p-5 rounded-xl -mb-[5%] items-end">
            <textarea
                ref={textareaRef}
                className="w-full resize-none border-0 focus:ring-0 text-lg 
                            placeholder-gray-500 focus:outline-none overflow-hidden"
                rows="1" 
                placeholder="Что нового?"
                value={postText}
                maxLength={256}
                onChange={(e) => {handlePostChange(e)}}
            />
            <hr className='w-[100%] mt-2 mb-2'/>
            <span className={`${postLength ? 'inline' : 'hidden'} text-sm`}>
                {postLength} / 256
            </span>
                <button
                    ref={postPushBtn}
                    onClick={handlePostSubmit}
                    disabled={!isButtonEnabled}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-150 mt-2 w-[25%] ${
                        isButtonEnabled 
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-blue-200 text-white cursor-not-allowed'
                    }`}
                >
                    Опубликовать
                </button>
        </div>
    );
};

export default PostPublisher;