import { redirect } from 'next/navigation';

import AnimeList from './components/anime-list';

const AnimeListPage = ({
    searchParams,
}: {
    searchParams: Record<string, string>;
}) => {
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
