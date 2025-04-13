import { prefetchFavorite } from '@/services/hooks/favorite/use-favorite';
import { prefetchNovelCharacters } from '@/services/hooks/novel/use-novel-characters';
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
        prefetchNovelCharacters({ slug }),
        prefetchFranchise({ slug, content_type: 'novel' }),
        auth ? prefetchFavorite({ slug, content_type: 'novel' }) : undefined,
    ]);
};

export default prefetchQueries;
