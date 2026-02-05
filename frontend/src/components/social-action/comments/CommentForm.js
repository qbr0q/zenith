import { useState, useRef, useEffect } from 'react';
import UserAvatar from '../../ui/user/UserAvatar'


const CommentForm = ({user}) => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [text]);

    return (
        <div className="ml-4 md:ml-6 mt-4 border-l-[1.5px] border-gray-400 pl-4 md:pl-6 !rounded-none">
            <div className='flex gap-4 items-center'>
                <div className="w-10"><UserAvatar user={user}/></div>
                <textarea
                    ref={textareaRef}
                    placeholder="Ответить..."
                    className="w-full resize-none border-0 focus:ring-0
                                placeholder-gray-500 focus:outline-none bg-transparent"
                    rows="1"
                    value={text}
                    maxLength={256}
                    onFocus={() => setIsFocused(true)}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
        <div className="flex flex-col items-end justify-end">
            {text.length > 200 &&
                <span className="text-[11px] text-right mt-1 text-gray-400 px-2">
                {text.length} / 256
            </span>}
            {(text && isFocused) && <button
                disabled={!text.trim()}
                onClick={() => alert(text)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.96]
            ${text.trim()
                    ? 'bg-[#277bcf] text-white shadow-sm hover:bg-[#378cdf]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
                <span>Отправить</span>
            </button>}
        </div>
    </div>
  );
};

export default CommentForm;