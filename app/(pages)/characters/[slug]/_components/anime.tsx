'use client';

import clsx from 'clsx';

import { useParams } from 'next/navigation';

import { useCharacterAnime } from '@/app/(pages)/characters/[slug]/page.hooks';
import AnimeCard from '@/components/anime-card';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import { useSettingsContext } from '@/services/providers/settings-provider';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterAnime(String(params.slug));

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
                className={clsx(
                    'grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8',
                )}
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <AnimeCard
                        slug={ch.anime.slug}
                        key={ch.anime.slug}
                        href={`/anime/${ch.anime.slug}`}
                        poster={ch.anime.poster}
                        title={
                            ch.anime[titleLanguage!] ||
                            ch.anime.title_ua ||
                            ch.anime.title_ua ||
                            ch.anime.title_ja
                        }
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
            {extended && hasNextPage && (
                <Button
                    variant="secondary"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </Button>
            )}
        </div>
    );
};

export default Component;