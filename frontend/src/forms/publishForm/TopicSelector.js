import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useReferenceBook } from '../../hooks/referenceBooks';


export const TopicSelector = ({ selectedTopics, setSelectedTopics }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: rbTopic, isLoading } = useReferenceBook('rbTopic');

    if (!!isLoading) {return}

    const toggleTopic = (topic) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topic));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
        setIsOpen(false)
    };

    return (
        <div className="w-full mb-8 ">
            {/* Выбранные темы */}
            <div
                className="min-h-[56px] p-2 border border-gray-200 rounded-xl flex flex-wrap gap-2 cursor-pointer bg-white transition-all duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedTopics.map(topic => (
                    <span key={topic.code} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        {topic.name}
                        <button onClick={(e) => { e.stopPropagation(); toggleTopic(topic); }}>
                            <FiX size={14} />
                        </button>
                    </span>
                ))}
                {selectedTopics.length === 0 && <span className="text-gray-400 p-1.5 ml-1">Выберите темы...</span>}
            </div>

            {/* Выпадающий список */}
            {isOpen && (
                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-62 overflow-y-auto">
                    {rbTopic.map(topic => (
                        <div
                            key={topic.code}
                            className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedTopics.includes(topic) ? 'bg-blue-50 text-blue-600 font-bold' : ''}`}
                            onClick={() => toggleTopic(topic)}
                        >
                            {topic.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};