import { prefetchFavorite } from '@/services/hooks/favorite/use-favorite';
import { prefetchMangaCharacters } from '@/services/hooks/manga/use-manga-characters';
import { prefetchFranchise } from '@/services/hooks/related/use-franchise';
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
        prefetchFranchise({ slug, content_type: 'manga' }),
        auth ? prefetchFavorite({ slug, content_type: 'manga' }) : undefined,
    ]);
};

export default prefetchQueries;
