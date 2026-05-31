import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiArrowLeft } from 'react-icons/fi';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReferenceBook } from '../../hooks/referenceBooks';


export const SearchBar = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { data: topics, isLoading } = useReferenceBook('rbTopic');

    // Извлекаем параметры из URL
    const queryParam = searchParams.get('query') || '';
    const topicParam = searchParams.get('topic') || '';

    const [query, setQuery] = useState(queryParam);
    const searchInputRef = useRef(null);
    const isInternalUpdate = useRef(false);

    // 1. Синхронизация с URL (поддерживает и query, и topic)
    useEffect(() => {
        const q = searchParams.get('query') || '';
        if (query !== q) {
            isInternalUpdate.current = true;
            setQuery(q);
        }
    }, [searchParams]);

    // 2. Движок поиска с поддержкой тем
    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams);

            if (query.trim()) {
                params.set('query', query.trim());
                navigate(`/search?${params.toString()}`, { replace: true });
            } else {
                params.delete('query');
                const remaining = params.toString();
                // Если есть другие параметры (например topic), остаемся, иначе на главную
                if (remaining) {
                    navigate(`/search?${remaining}`, { replace: true });
                } else if (location.pathname !== '/' && location.pathname.includes('/search')) {
                    navigate('/', { replace: true });
                }
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [query, searchParams]);

    if (!!isLoading) {return}
    const topicName = topics?.find(t => t.slug === topicParam)?.name || topicParam;

    // Удаление тега
    const clearTopic = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('topic');
        navigate(`/search?${params.toString()}`);
    };

    return (
        <div className="flex gap-4 items-center w-full">
            {location.state?.fromMain && (
                <button onClick={() => navigate(-1)}><FiArrowLeft size={40}/></button>
            )}

            <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm w-full flex items-center ">
                <div className="pl-5"><FiSearch className="text-gray-400" size={22} /></div>

                {/* Блок выбранного тега внутри инпута */}
                {topicParam && (
                    <div className="ml-3 flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium border border-blue-100">
                        <span>{topicName}</span>
                        <button onClick={clearTopic}><FiX size={14} /></button>
                    </div>
                )}

                <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={topicParam ? "Поиск внутри темы..." : "Поиск..."}
                    className="w-full py-5 bg-transparent pl-4 pr-16 text-[19px] outline-none"
                />

                <div className="absolute right-3 flex items-center gap-2">
                    {query && (
                        <button onClick={() => setQuery('')} className="p-1.5 text-gray-400 hover:text-black rounded-full transition-all">
                            <FiX size={18} />
                        </button>
                    )}
                    <div className="hidden md:flex bg-gray-50 border px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-400">
                        CTRL K
                    </div>
                </div>
            </div>
        </div>
    );
};