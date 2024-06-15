import { redirect } from 'next/navigation';
import { FC } from 'react';

import NovelList from '@/features/novel/novel-list/novel-list.component';

interface Props {
    searchParams: Record<string, string>;
}

const NovelListPage: FC<Props> = ({ searchParams }) => {
    const page = searchParams.page;

    if (!page) {
        return redirect(
            `/novel?page=1&iPage=1&${new URLSearchParams(
                searchParams,
            ).toString()}`,
        );
    }

    return <NovelList searchParams={searchParams} />;
};

export default NovelListPage;
