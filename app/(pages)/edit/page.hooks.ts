import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import useCharacterInfo from '@/services/hooks/characters/useCharacterInfo';

export const useContentData = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
    switch (content_type) {
        case 'anime':
            return useAnimeInfo(slug);
        case 'character':
            return useCharacterInfo(slug);
    }
};
