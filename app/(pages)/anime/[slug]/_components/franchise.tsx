'use client';

import clsx from 'clsx';

import { useParams } from 'next/navigation';

import AnimeCard from '@/components/anime-card';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import useFranchise from '@/services/hooks/anime/useFranchise';
import { useSettingsContext } from '@/services/providers/settings-provider';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const params = useParams();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });

    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useFranchise({ slug: String(params.slug) });

    if (!anime || !anime.has_franchise) {
        return null;
    }

    if (!list || list.length === 0) {
        return null;
    }

    const filterSelfData = list.filter((anime) => anime.slug !== params.slug);
    const filteredData = extended ? filterSelfData : filterSelfData.slice(0, 4);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title={`Пов’язане`}
                href={!extended ? params.slug + '/franchise' : undefined}
            />
            <div
                className={clsx(
                    'grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8',
                    extended && 'md:grid-cols-5',
                )}
            >
                {filteredData.map((anime) => (
                    <AnimeCard
                        key={anime.slug}
                        watch={
                            anime.watch.length > 0 ? anime.watch[0] : undefined
                        }
                        slug={anime.slug}
                        href={`/anime/${anime.slug}`}
                        poster={anime.poster}
                        title={
                            anime[titleLanguage!] ||
                            anime.title_ua ||
                            anime.title_en ||
                            anime.title_ja
                        }
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
            {extended && hasNextPage && (
                <Button
                    variant="outline"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Завантажити ще
                </Button>
            )}
        </div>
    );
};

export default Component;
