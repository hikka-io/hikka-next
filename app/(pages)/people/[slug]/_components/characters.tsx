'use client';

import clsx from 'clsx';
import * as React from 'react';

import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import EntryCard from '@/components/entry-card/entry-card';
import { Button } from '@/components/ui/button';
import usePersonCharacters from '@/services/hooks/people/usePersonCharacters';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { cn } from '@/utils';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        usePersonCharacters({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title={'Персонажі'}
                href={!extended ? params.slug + '/characters' : undefined}
            />
            <div
                className={cn(
                    'grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8',
                    !extended && 'grid-min-10 no-scrollbar -mx-4 grid-flow-col grid-cols-scroll-5 overflow-x-auto px-4'

                )}
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <EntryCard
                        key={ch.character.slug + ch.anime.slug}
                        href={`/characters/${ch.character.slug}`}
                        poster={ch.character.image}
                        title={
                            ch.character.name_ua ||
                            ch.character.name_en ||
                            ch.character.name_ja
                        }
                        slug={ch.character.slug}
                        withContextMenu
                        content_type="character"
                        disableChildrenLink
                        description={ch.anime[titleLanguage!] || ch.anime.title_ua || ch.anime.title_en || ch.anime.title_ja}
                    >
                        <div className="absolute bottom-0 left-0 z-0 h-16 w-full bg-gradient-to-t from-black to-transparent" />
                        <div className="absolute bottom-2 right-2 z-[1] flex h-auto w-16 rounded-lg border border-secondary/60 shadow-lg transition-all hover:w-28">
                            <EntryCard
                                href={`/anime/${ch.anime.slug}`}
                                poster={ch.anime.poster}
                            />
                        </div>
                    </EntryCard>
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
