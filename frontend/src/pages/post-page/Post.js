import { useQuery } from "@tanstack/react-query";
import { useParams } from 'react-router-dom';
import { useFetch } from "../../hooks/fetch";
import PostSkeleton from "../../components/ui/PostSkeleton";
import ContentContainer from "../../components/ui/entry-ui/ContentContainer";


const Post = () => {
    const { postSlug } = useParams();
    const { executeFetch: api } = useFetch();

    const { data: post, isLoading, error } = useQuery({
        queryKey: ['post', postSlug],
        queryFn: async () => {
            return await api("get", `posts/${postSlug}/`);
        },
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <PostSkeleton />
            </div>
        );
    }

    if (!post || error) {
        return <div className="flex flex-col text-red-500 mt-8 text-3xl items-center">
            <p>{error || "Пост не найден"}</p>
            </div>
    }

    return <ContentContainer contentItems={[post]} />
}

export default Post