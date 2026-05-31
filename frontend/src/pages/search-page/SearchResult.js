import { useSearchParams } from 'react-router';
import { useFetch } from "../../hooks/fetch";
import { useQuery } from "@tanstack/react-query";
import ContentContainer from "../../components/ui/entry-ui/ContentContainer";
import PostSkeleton from "../../components/ui/PostSkeleton";


export const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const topic = searchParams.get('topic');
    const { executeFetch: api } = useFetch();

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['search_result', query, topic],

        queryFn: async () => {
            // Формируем параметры для API
            const params = new URLSearchParams();
            if (query) params.append('query', query);
            if (topic) params.append('topic', topic);

            return await api(`search?${params.toString()}`);
        },
        staleTime: 1000 * 60 * 5,
        // Важно: не запускать запрос, если нет ни query, ни topic
        enabled: !!query || !!topic,
    });

    if (isLoading) {
        return <div className="space-y-4"><PostSkeleton /></div>;
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex flex-col text-gray-500 mt-8 text-xl items-center">
                <p>Ничего не найдено</p>
            </div>
        );
    }

    return <ContentContainer contentItems={posts} />;
};