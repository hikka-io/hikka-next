'use client';

import clsx from 'clsx';

import { useParams } from 'next/navigation';

import EntryCard from '@/components/entry-card/entry-card';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import useCharacterAnime from '@/services/hooks/characters/useCharacterAnime';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { cn } from '@/utils/utils';

interface Props {
    extended?: boolean;
}

const Anime = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterAnime({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title={'Аніме'}
                href={!extended ? params.slug + '/anime' : undefined}
            />
            <div
                className={cn(
                    'grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8',
                    !extended && 'grid-min-10 no-scrollbar -mx-4 grid-flow-col grid-cols-scroll-5 overflow-x-auto px-4'
                )}
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <EntryCard
                        slug={ch.anime.slug}
                        content_type="anime"
                        key={ch.anime.slug}
                        href={`/anime/${ch.anime.slug}`}
                        poster={ch.anime.poster}
                        withContextMenu
                        title={
                            ch.anime[titleLanguage!] ||
                            ch.anime.title_ua ||
                            ch.anime.title_ua ||
                            ch.anime.title_ja
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

export default Anime;
