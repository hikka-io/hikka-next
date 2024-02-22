'use client';

import clsx from 'clsx';

import { useParams } from 'next/navigation';

import { useAnimeInfo } from '@/app/page.hooks';
import AnimeCard from '@/components/anime-card';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useSettingsContext } from '@/services/providers/settings-provider';

import { useFranchise } from '../page.hooks';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const { secret } = useAuthContext();
    const params = useParams();
    const { data: anime } = useAnimeInfo(String(params.slug));

    if (!anime || !anime.has_franchise) {
        return null;
    }

    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useFranchise(String(params.slug), secret);

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