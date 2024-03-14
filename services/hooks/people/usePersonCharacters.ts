import getPersonCharacters from '@/services/api/people/getPersonCharacters';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const usePersonCharacters = ({ slug }: { slug: string }) => {
    return useInfiniteList({
        queryKey: ['personCharacters', slug],
        queryFn: ({ pageParam = 1 }) =>
            getPersonCharacters({
                slug: slug,
                page: pageParam,
            }),
    });
};

export default usePersonCharacters;
