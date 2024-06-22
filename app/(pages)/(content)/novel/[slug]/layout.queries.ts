import { prefetchFavorite } from '@/services/hooks/favorite/use-favorite';
import { prefetchNovelCharacters } from '@/services/hooks/novel/use-novel-characters';
import { getCookie } from '@/utils/cookies';

interface Props {
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ params: { slug } }: Props) => {
    const auth = await getCookie('auth');

    await Promise.all([
        prefetchNovelCharacters({ slug }),
        auth ? prefetchFavorite({ slug, content_type: 'novel' }) : undefined,
    ]);
};

export default prefetchQueries;
