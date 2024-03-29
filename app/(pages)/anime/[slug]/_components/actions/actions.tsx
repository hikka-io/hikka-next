import { getCookie } from '@/app/actions';
import WatchListButton from '@/components/watchlist-button';

import WatchStats from './_components/watch-stats';

interface Props {
    anime?: API.AnimeInfo;
}

const Actions = async ({ anime }: Props) => {
    if (!anime) {
        return null;
    }

    const auth = await getCookie('auth');

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <WatchListButton
                    disabled={!auth}
                    additional
                    slug={String(anime.slug)}
                />
                <WatchStats />
            </div>
        </div>
    );
};

export default Actions;
