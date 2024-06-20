import { prefetchCharacterAnime } from '@/services/hooks/characters/use-character-anime';
import { prefetchCharacterVoices } from '@/services/hooks/characters/use-character-voices';
import { prefetchFavorite } from '@/services/hooks/favorite/use-favorite';

interface Props {
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ params: { slug } }: Props) => {
    await Promise.all([
        prefetchCharacterAnime({ slug }),
        prefetchCharacterVoices({ slug }),
        prefetchFavorite({ slug, content_type: 'character' }),
    ]);
};

export default prefetchQueries;
