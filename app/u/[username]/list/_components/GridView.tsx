'use client';

import { Response } from '@/utils/api/watch/getWatchList';
import AnimeCard from '@/app/_components/AnimeCard';

interface Props {
    data: Response;
}

const Component = ({ data }: Props) => {
    return (
        <div className="grid md:grid-cols-5 grid-cols-2 md:gap-8 gap-4">
            {data.list.map((res) => (
                <AnimeCard
                    slug={res.anime.slug}
                    key={res.reference}
                    title={
                        res.anime.title_ua ||
                        res.anime.title_en ||
                        res.anime.title_ja
                    }
                    poster={res.anime.poster}
                    href={`/anime/${res.anime.slug}`}
                />
            ))}
        </div>
    );
};

export default Component;
