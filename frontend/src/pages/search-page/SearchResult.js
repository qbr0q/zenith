import { useSearchParams } from 'react-router';
import { useFetch } from "../../hooks/fetch";
import { useQuery } from "@tanstack/react-query";
import ContentContainer from "../../components/ui/entry-ui/ContentContainer";
import PostSkeleton from "../../components/ui/PostSkeleton";


export const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const { executeFetch: api } = useFetch();

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['search_result', query],
        queryFn: async () => {
        debugger
            return await api(`search?query=${encodeURIComponent(query)}`);
        },
        staleTime: 1000 * 60 * 5,
    });

    if (!!isLoading) {
        return (
            <div className="space-y-4">
                <PostSkeleton />
            </div>
        );
    }

    if (!posts || error) {
        return <div className="flex flex-col text-red-500 mt-8 text-3xl items-center">
            <p>{error || "Нет результатов поиска"}</p>
        </div>
    }

    return <ContentContainer contentItems={posts} />
};