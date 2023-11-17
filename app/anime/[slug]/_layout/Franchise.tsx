'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeFranchise from '@/utils/api/anime/getAnimeFranchise';
import AnimeCard from '@/app/_components/AnimeCard';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import SubHeader from '@/app/_components/SubHeader';

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
            <SubHeader
                title={`Пов'язане`}
                href={!extended ? params.slug + '/franchise' : undefined}
            />
            <div className="grid md:grid-cols-5 grid-cols-2 gap-4 md:gap-8">
                {filteredData.map((anime) => (
                    <AnimeCard
                        key={anime.slug}
                        slug={anime.slug}
                        href={`/anime/${anime.slug}`}
                        poster={anime.poster}
                        title={
                            anime.title_ua || anime.title_en || anime.title_ja
                        }
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
        </div>
    );
};

export default Component;