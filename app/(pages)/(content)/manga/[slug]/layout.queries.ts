import { prefetchFavorite } from '@/services/hooks/favorite/use-favorite';
import { prefetchMangaCharacters } from '@/services/hooks/manga/use-manga-characters';
import { getCookie } from '@/utils/cookies';

interface Props {
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ params: { slug } }: Props) => {
    const auth = await getCookie('auth');

    await Promise.all([
        prefetchMangaCharacters({ slug }),
        auth ? prefetchFavorite({ slug, content_type: 'manga' }) : undefined,
    ]);
};

export default prefetchQueries;
