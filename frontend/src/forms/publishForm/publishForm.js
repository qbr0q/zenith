import {useCallback, useEffect, useRef, useState} from "react";
import {useModal} from '../../hooks/modalProvider'
import { FiImage } from "react-icons/fi";
import { MentionList } from "./MentionList"
import { TopicSelector } from "./TopicSelector"


const config = {
    post: {
        textareaPlaceholder: "Что нового?",
        buttonPlaceholder: "Опубликовать"
    },
    comment: {
        textareaPlaceholder: "Ответить",
        buttonPlaceholder: "Опубликовать"
    }
}

const users = [{ id: 1, name: "ZenithAi", bio: "Ai Agent", info: {avatar_url: "ZenithAi.png"}, username: "123" }];


export const PublishForm = ({type, onSubmit}) => {
    const { textareaPlaceholder, buttonPlaceholder } = config[type];
    const [postText, setPostText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [mentionOpen, setMentionOpen] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const textareaRef = useRef(null);
    const postPushBtn = useRef(null);
    const fileInputRef = useRef(null);
    const {handleCloseModal} = useModal();

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [postText]);

    const isEnableData = postText.trim().length > 0 || selectedFiles.length > 0;

    const handlePostSubmit = useCallback(() => {
        const formData = new FormData();
        formData.append('text', postText);
        selectedTopics.forEach(topic => {
            formData.append('topic', topic.id);
        });
        selectedFiles.forEach(fileObj => {
            formData.append('data', fileObj.file);
        });

        onSubmit(formData);
        setSelectedFiles([]);
        setPostText("");
        handleCloseModal();
    }, [postText, selectedFiles, onSubmit, handleCloseModal]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // генерируем объекты с превью для каждого файла
        const newFiles = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            url: URL.createObjectURL(file)
        }));
        // добавляем к уже выбранным
        setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 10));
    };

    const triggerFileInput = () => fileInputRef.current.click();

    const handlePostChange = (e) => {
        const newValue = e.target.value;
        setPostText(newValue)

        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = newValue.slice(0, cursorPosition);

        if (textBeforeCursor.endsWith('@')) {
            setMentionOpen(true);
        } else if (newValue.endsWith(' ') || newValue === '') {
            setMentionOpen(false);
        }
    }

    const handleSelectUser = useCallback((user) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const cursorPosition = textarea.selectionStart;
        const textBefore = postText.slice(0, cursorPosition);
        const textAfter = postText.slice(cursorPosition);

        const lastAtIdx = textBefore.lastIndexOf('@');
        const newText = textBefore.slice(0, lastAtIdx) + `@${user.name} ` + textAfter;

        setPostText(newText);
        setMentionOpen(false);
        textarea.focus();
    }, [postText]);

    const removeFile = (id) => {
        setSelectedFiles(prev => {
            const filtered = prev.filter(f => f.id !== id);
            // освобождаем память от URL.createObjectURL
            const deleted = prev.find(f => f.id === id);
            if (deleted) URL.revokeObjectURL(deleted.url);
            return filtered;
        });
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            if (mentionOpen) {
                e.preventDefault();
                handleSelectUser(users[0]); // Выбираем первого из списка
                return;
            }
            if (e.ctrlKey) {
                if (isEnableData) {
                    e.preventDefault();
                    handlePostSubmit();
                }
            }
        }
    }, [mentionOpen, handlePostSubmit, handleSelectUser, isEnableData]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown])

    return <div className="flex flex-col items-end">
        {selectedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2 w-full mb-4">
                {selectedFiles.map((file) => (
                    <div key={file.id} className="relative aspect-square">
                        <img
                            src={file.url}
                            className="rounded-lg object-cover w-full h-full border"
                            alt="Preview"
                        />
                        <button
                            onClick={() => removeFile(file.id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5
                            text-[10px] flex items-center justify-center hover:bg-red-600"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        )}
        <div className="relative w-full z-10">
            <MentionList
                users={users}
                isOpen={mentionOpen}
                onSelect={handleSelectUser}
            />
            <TopicSelector
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
            />
            <textarea
                autoFocus
                ref={textareaRef}
                className="w-full resize-none border-0 focus:ring-0 text-lg
                    placeholder-gray-500 focus:outline-none overflow-hidden"
                rows="1"
                placeholder={textareaPlaceholder}
                value={postText}
                maxLength={256}
                onChange={(e) => {handlePostChange(e)}}
            />
            {postText.length > 200 &&
                <span className="text-[11px] text-right mt-1 text-gray-400 px-2">
                    {postText.length} / 256
                </span>}
            <div className="flex justify-between w-full mt-4">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <button onClick={triggerFileInput} >
                    <FiImage size={22} />
                </button>
                <button
                    ref={postPushBtn}
                    onClick={handlePostSubmit}
                    disabled={!isEnableData}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-150 w-full
                            max-w-[150px] ${
                        isEnableData
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-blue-200 text-white cursor-not-allowed'
                    }`}
                >
                    {buttonPlaceholder}
                </button>
            </div>
        </div>
    </div>
}
