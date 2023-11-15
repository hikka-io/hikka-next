'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeFranchise from '@/utils/api/anime/getAnimeFranchise';
import AnimeCard from '@/app/_components/AnimeCard';
import Link from 'next/link';
import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded'
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const { data: anime } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!anime || !anime.has_franchise) {
        return null;
    }

    const { data } = useQuery({
        queryKey: ['franchise', params.slug],
        queryFn: () => getAnimeFranchise({ slug: String(params.slug) }),
    });

    if (!data || !data.list || data.list.length === 0) {
        return null;
    }

    const filterSelfData = data.list.filter(
        (anime) => anime.slug !== params.slug,
    );
    const filteredData = extended ? filterSelfData : filterSelfData.slice(0, 5);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h3>{`Пов'язане`}</h3>
                {!extended && (
                    <Link
                        href={params.slug + '/franchise'}
                        className="btn btn-badge btn-ghost btn-square"
                    >
                        <MaterialSymbolsArrowRightAltRounded className="text-2xl" />
                    </Link>
                )}
            </div>
            <div className="grid md:grid-cols-5 grid-cols-2 gap-4 md:gap-8">
                {filteredData.map((anime) => (
                    <AnimeCard
                        key={anime.slug}
                        slug={anime.slug}
                        href={`/anime/${anime.slug}`}
                        poster={anime.poster}
                        title={anime.title_ua || anime.title_en || anime.title_ja}
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
        </div>
    );
};

export default Component;
