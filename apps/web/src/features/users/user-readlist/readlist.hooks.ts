import { useParams, useSearchParams } from 'next/navigation';

import useReadList from '@/services/hooks/read/use-read-list';

export const useList = () => {
    const searchParams = useSearchParams()!;
    const params = useParams();

    const readStatus = searchParams.get('status');

    const media_type = searchParams.getAll('types');
    const status = searchParams.getAll('statuses');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const magazines = searchParams.getAll('magazines');

    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'read_score';

    return useReadList({
        content_type: params.content_type as 'manga' | 'novel',
        username: String(params.username),
        read_status: String(readStatus) as API.ReadStatus,
        media_type,
        status,
        years,
        genres,
        magazines,
        sort: sort && order ? [`${sort}:${order}`] : undefined,
    });
};
