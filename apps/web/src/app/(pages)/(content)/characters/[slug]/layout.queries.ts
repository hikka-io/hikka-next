import { prefetchCharacterAnime } from '../../../../../services/hooks/characters/use-character-anime';
import { prefetchCharacterManga } from '../../../../../services/hooks/characters/use-character-manga';
import { prefetchCharacterNovel } from '../../../../../services/hooks/characters/use-character-novel';
import { prefetchCharacterVoices } from '../../../../../services/hooks/characters/use-character-voices';
import { prefetchFavorite } from '../../../../../services/hooks/favorite/use-favorite';

interface Props {
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ params: { slug } }: Props) => {
    await Promise.all([
        prefetchCharacterAnime({ slug }),
        prefetchCharacterManga({ slug }),
        prefetchCharacterNovel({ slug }),
        prefetchCharacterVoices({ slug }),
        prefetchFavorite({ slug, content_type: 'character' }),
    ]);
};

export default prefetchQueries;
