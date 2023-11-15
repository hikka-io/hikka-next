'use client';

import Link from 'next/link';
import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded'
import { useParams } from 'next/navigation';
import AnimeCard from '@/app/_components/AnimeCard';
import { useQuery } from '@tanstack/react-query';
import getFavouriteList from '@/utils/api/favourite/getFavouriteList';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['favorites', params.username],
        queryFn: () => getFavouriteList({ username: String(params.username) }),
        staleTime: 0,
    });

    if (!data || !data.list) {
        return null;
    }

    if (data.list.length === 0 && !extended) {
        return null;
    }

    const filteredData = extended ? data.list : data.list.slice(0, 5);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h3>Улюблені</h3>
                {!extended && (
                    <Link
                        href={'/u/' + params.username + '/favorites'}
                        className="btn btn-sm btn-square btn-ghost"
                    >
                        <MaterialSymbolsArrowRightAltRounded className="text-2xl" />
                    </Link>
                )}
            </div>
            <div className="grid md:grid-cols-5 grid-cols-2 md:gap-8 gap-4">
                {filteredData.map((res) => (
                    <AnimeCard
                        key={res.reference}
                        title={
                            res.anime.title_ua ||
                            res.anime.title_en ||
                            res.anime.title_ja
                        }
                        poster={res.anime.poster}
                        href={'/anime/' + res.anime.slug}
                        slug={res.anime.slug}
                    />
                ))}
            </div>
        </div>
    );
};

export default Component;
