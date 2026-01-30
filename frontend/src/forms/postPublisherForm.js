import {useCallback, useEffect, useRef, useState} from "react";
import {useFetch} from "../hooks/fetch";
import {usePostPublisherForm} from "../hooks/forms";
import {getUser} from "../components/Utils";
import {useModal} from '../hooks/modalProvider'

const PostPublisherForm = () => {
    const [postText, setPostText] = useState('');
    const [postLength, setPostLength] = useState(0);
    const textareaRef = useRef(null);
    const postPushBtn = useRef(null);
    const { executeFetch } = useFetch();
    const openPostPublisherForm = usePostPublisherForm();
    const {handleCloseModal} = useModal();

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
            handleCloseModal()
        }
    };

    const handlePostChange = (e) => {
        const newValue = e.target.value;
        setPostText(newValue)
        setPostLength(newValue.length)
    }

    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            postPushBtn.current?.click()
        }}, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
    }, [handleKeyDown])

    return <div className="flex flex-col items-end">
        <textarea
            autoFocus
            ref={textareaRef}
            className="w-full resize-none border-0 focus:ring-0 text-lg
                placeholder-gray-500 focus:outline-none overflow-hidden"
            rows="1"
            placeholder="Что нового?"
            value={postText}
            maxLength={256}
            onClick={openPostPublisherForm}
            onChange={(e) => {handlePostChange(e)}}
        />
        {postLength > 200 &&
            <span className="text-[11px] text-right mt-1 text-gray-400 px-2">
                {postLength} / 256
            </span>}
        <button
            ref={postPushBtn}
            onClick={handlePostSubmit}
            disabled={!isButtonEnabled}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-150 mt-2 w-full 
                    max-w-[150px] ${
                isButtonEnabled
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-blue-200 text-white cursor-not-allowed'
            }`}
        >
            Опубликовать
        </button>
    </div>
}

export default PostPublisherForm;