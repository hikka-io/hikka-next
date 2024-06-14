import { redirect } from 'next/navigation';
import { FC } from 'react';

import MangaList from '@/features/manga/manga-list/manga-list.component';

interface Props {
    searchParams: Record<string, string>;
}

const MangaListPage: FC<Props> = ({ searchParams }) => {
    const page = searchParams.page;

    if (!page) {
        return redirect(
            `/manga?page=1&iPage=1&${new URLSearchParams(
                searchParams,
            ).toString()}`,
        );
    }

    return <MangaList searchParams={searchParams} />;
};

export default MangaListPage;
