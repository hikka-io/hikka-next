import { FC } from 'react';

import { redirect } from 'next/navigation';

import AnimeList from './components/anime-list';

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

    return <AnimeList searchParams={searchParams} />;
};

export default AnimeListPage;
