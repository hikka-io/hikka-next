import { useParams, useSearchParams } from 'next/navigation';

import useWatchList from '@/services/hooks/watch/use-watch-list';

const useList = () => {
    const searchParams = useSearchParams()!;
    const params = useParams();

    const watchStatus = searchParams.get('status');
    const view = searchParams.get('view') || 'table';

    const media_type = searchParams.getAll('types');
    const status = searchParams.getAll('statuses');
    const season = searchParams.getAll('seasons');
    const rating = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const studios = searchParams.getAll('studios');

    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'watch_score';

    return useWatchList({
        username: String(params.username),
        watch_status: String(watchStatus) as API.WatchStatus,
        media_type,
        status,
        season,
        rating,
        years,
        genres,
        studios,
        sort: sort && order ? [`${sort}:${order}`] : undefined,
    });
};

export default useList;
