import { Link } from 'react-router-dom';


const TOPIC_COLORS = {
    0: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
    1: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    2: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    3: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    4: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    5: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
};

const getTopicStyles = (code) => TOPIC_COLORS[code] || TOPIC_COLORS[0];

export const TopicTag = ({ item }) => {
    return (
        item.topics && item.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {item.topics.map((topic) => {
                    const styles = getTopicStyles(topic.code);
                    return (
                        <Link
                            key={topic.code}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles.bg} ${styles.text} ${styles.border} transition-colors hover:opacity-80`}
                            to={`/search?topic=${topic.slug}`}
                        >
                            {topic.name}
                        </Link>
                    );
                })}
            </div>
        )
    );
};