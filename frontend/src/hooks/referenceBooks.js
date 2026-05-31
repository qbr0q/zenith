import { useQuery } from '@tanstack/react-query';
import { useFetch } from '../hooks/fetch';


export const useReferenceBook = (endpoint) => {
    const { executeFetch } = useFetch();

    return useQuery({
        queryKey: ['refBook', endpoint],
        queryFn: async () => {
            const data = await executeFetch(`reference_book/${endpoint}`);
            return data;
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });
};
