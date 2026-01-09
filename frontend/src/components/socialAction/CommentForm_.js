import { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser } from 'react-icons/fi';

const CommentForm = ({setIsCommentOpen}) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const onCancel = () => {
    setIsCommentOpen(false)
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="flex gap-3">
        <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center border 
                        border-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
            <FiUser size={24} />
        </div>

        <div className="flex-1">
            <textarea
            ref={textareaRef}
            placeholder="Написать ответ..."
            className="w-full resize-none border-0 focus:ring-0 text-[15px] 
                        placeholder-gray-500 focus:outline-none bg-transparent min-h-[40px] py-1.5"
            rows="1"
            value={text}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setText(e.target.value)}
            />

            <div className="flex items-center justify-end animate-in 
                            fade-in slide-in-from-top-1 duration-200">

                {/* Кнопки управления */}
                <div className="flex items-center gap-2">
                <button 
                    onClick={() => {
                        setIsFocused(false);
                        setText('');
                        onCancel();
                    }}
                    className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                    Отмена
                </button>
                <button
                    disabled={!text.trim()}
                    onClick={() => alert(text)}
                    className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-semibold transition-all
                    ${text.trim() 
                        ? 'bg-[rgba(39,123,207,1)] text-white shadow-md hover:bg-[rgb(55,140,223)]' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                    <span>Опубликовать</span>
                    <FiSend size={14} />
                </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CommentForm;