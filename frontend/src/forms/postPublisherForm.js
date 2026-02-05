import {useCallback, useEffect, useRef, useState} from "react";
import {useFetch} from "../hooks/fetch";
import {useModal} from '../hooks/modalProvider'
import { FiImage } from "react-icons/fi";


const PostPublisherForm = () => {
    const [postText, setPostText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const textareaRef = useRef(null);
    const postPushBtn = useRef(null);
    const fileInputRef = useRef(null);
    const { executeFetch } = useFetch();
    const {handleCloseModal} = useModal();

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [postText]);

    const isButtonEnabled = postText.trim().length > 0 || selectedFiles.length > 0;

    const handlePostSubmit = () => {
        const formData = new FormData();
        formData.append('text', postText);
        selectedFiles.forEach(fileObj => {
            formData.append('data', fileObj.file);
        });

        try {
            executeFetch('post', 'post/create_post', formData)
            setSelectedFiles([]);
            setPostText("");
            handleCloseModal()
        } catch (error) {
            console.error(error);
        }
    };

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
    }

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
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            postPushBtn.current?.click()
        }}, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
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
        <textarea
            autoFocus
            ref={textareaRef}
            className="w-full resize-none border-0 focus:ring-0 text-lg
                placeholder-gray-500 focus:outline-none overflow-hidden"
            rows="1"
            placeholder="Что нового?"
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
                disabled={!isButtonEnabled}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-150 w-full 
                        max-w-[150px] ${
                    isButtonEnabled
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-blue-200 text-white cursor-not-allowed'
                }`}
            >
                Опубликовать
            </button>
        </div>
    </div>
}

export default PostPublisherForm;