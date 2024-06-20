import { redirect } from 'next/navigation';
import { FC } from 'react';

import AnimeList from '@/features/anime/anime-list/anime-list.component';

interface Props {
    searchParams: Record<string, string>;
}

const AnimeListPage: FC<Props> = ({ searchParams }) => {
    const page = searchParams.page;

    if (!page) {
        return redirect(
            `/anime?page=1&iPage=1&${new URLSearchParams(
                searchParams,
            ).toString()}`,
        );
    }

    return <AnimeList />;
};

export default AnimeListPage;
