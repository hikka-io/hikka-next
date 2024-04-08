'use client';

import clsx from 'clsx';

import { useParams } from 'next/navigation';

import EntryCard from '@/components/entry-card/entry-card';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import useFranchise from '@/services/hooks/anime/useFranchise';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { MEDIA_TYPE } from '@/utils/constants';
import { cn } from '@/utils/utils';

interface Props {
    extended?: boolean;
}

const Franchise = ({ extended }: Props) => {
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
                className={cn(
                    'grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8',
                    extended && 'md:grid-cols-5',
                    !extended && 'no-scrollbar grid-min-10 -mx-4 grid-flow-col grid-cols-scroll auto-cols-scroll overflow-x-auto px-4',
                )}/*repeat(2, minmax(0, 1fr))*/
            >
                {filteredData.map((anime) => (
                    <EntryCard
                        key={anime.slug}
                        watch={
                            anime.watch.length > 0 ? anime.watch[0] : undefined
                        }
                        slug={anime.slug}
                        content_type="anime"
                        withContextMenu
                        href={`/anime/${anime.slug}`}
                        poster={anime.poster}
                        title={
                            anime[titleLanguage!] ||
                            anime.title_ua ||
                            anime.title_en ||
                            anime.title_ja
                        }
                        leftSubtitle={
                            anime.year ? String(anime.year) : undefined
                        }
                        rightSubtitle={
                            anime.media_type &&
                            MEDIA_TYPE[anime.media_type].title_ua
                        }
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

export default Franchise;
