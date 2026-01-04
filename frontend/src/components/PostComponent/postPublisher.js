import { useState, useRef, useEffect } from 'react';
import { FiImage, FiSmile  } from "react-icons/fi";
import { useFetch } from '../../hooks/fetch';
import { getUser } from '../Utils'

const PostPublisher = () => {
    const [postText, setPostText] = useState('');
    const textareaRef = useRef(null);
    const { executeFetch } = useFetch();

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
  }, [postText]);

    // Проверка, есть ли текст, чтобы активировать кнопку
    const isButtonEnabled = postText.trim().length > 0;

    const handlePostSubmit = () => {
        if (isButtonEnabled) {
            const user = getUser()
            executeFetch('post', 'post/create_post', {
                post_content: postText,
                user_id: user.id
            }).then(() => {console.log('Пост успешно опубликован!')})
            setPostText('');
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl -mb-[5%]">
            <div className="flex space-x-3">
                <div className="flex-1 min-w-0">
                    
                    {/* Поле ввода текста */}
                    <textarea
                        ref={textareaRef}
                        className="w-full resize-none border-0 focus:ring-0 text-lg 
                                    placeholder-gray-500 focus:outline-none overflow-hidden"
                        rows="1" 
                        placeholder="Что нового?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                    />
                    
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Панель управления (Иконки и Кнопка) */}
                    <div className="flex justify-between items-center pt-2">
                        
                        {/* Левая часть: Иконки для медиа */}
                        <div className="flex justify-between text-xl w-[12%]">
                            <FiImage/>
                            <FiSmile/>
                        </div>

                        {/* Правая часть: Кнопка публикации */}
                        <button
                            onClick={handlePostSubmit}
                            disabled={!isButtonEnabled}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-150 ${
                                isButtonEnabled 
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-blue-200 text-white cursor-not-allowed'
                            }`}
                        >
                            Опубликовать
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PostPublisher;