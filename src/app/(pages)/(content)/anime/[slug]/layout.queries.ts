import { prefetchCharacters } from '@/services/hooks/anime/use-characters';
import { prefetchStaff } from '@/services/hooks/anime/use-staff';
import { prefetchFavorite } from '@/services/hooks/favorite/use-favorite';
import { prefetchFranchise } from '@/services/hooks/related/use-franchise';
import { prefetchFollowingWatchList } from '@/services/hooks/watch/use-following-watch-list';
import { prefetchWatch } from '@/services/hooks/watch/use-watch';
import { getCookie } from '@/utils/cookies';

interface Props {
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ params: { slug } }: Props) => {
    const auth = await getCookie('token');

    await Promise.all([
        prefetchCharacters({ slug }),
        prefetchFranchise({ slug, content_type: 'anime' }),
        prefetchStaff({ slug }),
        auth ? prefetchWatch({ slug }) : undefined,
        auth ? prefetchFavorite({ slug, content_type: 'anime' }) : undefined,
        auth ? prefetchFollowingWatchList({ slug }) : undefined,
    ]);
};

export default prefetchQueries;
