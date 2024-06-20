import { prefetchFollowStats } from '@/services/hooks/follow/use-follow-stats';
import { prefetchReadStats } from '@/services/hooks/read/use-read-stats';
import { prefetchUser } from '@/services/hooks/user/use-user';
import { prefetchWatchStats } from '@/services/hooks/watch/use-watch-stats';

interface Props {
    params: {
        username: string;
    };
}

const prefetchQueries = async ({ params: { username } }: Props) => {
    await Promise.all([
        prefetchUser({ username }),
        prefetchReadStats({ username, content_type: 'manga' }),
        prefetchReadStats({ username, content_type: 'novel' }),
        prefetchWatchStats({ username }),
        prefetchFollowStats({ username }),
    ]);
};

export default prefetchQueries;
