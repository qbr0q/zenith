import { useSearchParams } from 'react-router'
import { FiSearch, FiX } from 'react-icons/fi';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi";


export const SearchBar = () => {
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('query') || '';
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState(queryParam);
    const searchInputRef = useRef(null);
    const isInternalUpdate = useRef(false);
    const canGoBack = location.state?.fromMain;

    // 1. Эффект для синхронизации с URL
    useEffect(() => {
        const newQuery = searchParams.get('query') || '';
        if (query !== newQuery) {
            isInternalUpdate.current = true;
            setQuery(newQuery);
        }
    }, [searchParams]);

    // 2. Эффект с таймером (наш поисковый движок)
    useEffect(() => {
        // Если обновление было "изнутри" (из URL), то этот эффект не должен ничего делать
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        // Иначе запускаем таймер...
        const handler = setTimeout(() => {
            // Если есть запрос — идем в поиск
            if (query.trim()) {
                navigate(`/search?query=${encodeURIComponent(query)}`, { replace: true });
            }
            // 3. Если запроса нет, но мы НЕ на главной (т.е. мы в результатах поиска)
            // Только тогда выкидываем на главную
            else if (location.pathname !== '/') {
                navigate('/', { replace: true });
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [query]);

    const handleKeyDown = useCallback((e) => {
        if ((e.ctrlKey || e.metaKey) && ('k', 'л').includes(e.key.toLowerCase())) {
            e.preventDefault();
            searchInputRef.current?.focus();
        }
        if (e.key === 'Escape') {
            setQuery('');
            searchInputRef.current?.blur();
        }
    }, [query]); // зависимость от query обязательна!

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

//    useEffect(() => {
//        const handler = setTimeout(async () => {
//            if (query.trim()) {
//                navigate(`/search?query=${query}`)
//            } else if (location.pathname.includes('/search')) {navigate('/')}
//        }, 500);
//
//        return () => clearTimeout(handler); // чистим таймер, если юзер продолжает печатать
//    }, [query]);

    return (
        <div className="flex gap-4 items-center">
            {/* Кнопка назад */}
            {canGoBack && (
                <button onClick={() => navigate(-1)}>
                    <FiArrowLeft size={40}/>
                </button>
            )}

            <div className="relative group bg-white border border-gray-200 rounded-xl transition-all shadow-sm w-full flex items-center">
                <div className="pl-5">
                    <FiSearch className="text-gray-400" size={22} />
                </div>

                <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Поиск..."
                    className="w-full bg-transparent py-5 pl-4 pr-16 text-[19px] outline-none"
                />

                <div className="absolute right-3 flex items-center gap-2">
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                        >
                            <FiX size={18} />
                        </button>
                    )}

                    <div className="hidden md:flex items-center justify-center bg-gray-50 border border-gray-200
                                    px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="text-[11px] font-bold text-gray-400 tracking-wider">
                            CTRL K
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};