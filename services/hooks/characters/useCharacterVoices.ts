import getCharacterVoices from '@/services/api/characters/getCharacterVoices';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const usePersonCharacters = ({ slug }: { slug: string }) => {
    return useInfiniteList({
        queryKey: ['characterVoices', slug],
        queryFn: ({ pageParam = 1 }) =>
            getCharacterVoices({
                slug: slug,
                page: pageParam,
            }),
    });
};

export default usePersonCharacters;
