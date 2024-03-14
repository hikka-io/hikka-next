'use client';

import clsx from 'clsx';
import * as React from 'react';

import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import BaseCard from '@/components/ui/base-card';
import { Button } from '@/components/ui/button';
import useCharacterVoices from '@/services/hooks/characters/useCharacterVoices';
import { useSettingsContext } from '@/services/providers/settings-provider';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterVoices({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title={'Сейю'}
                href={!extended ? params.slug + '/voices' : undefined}
            />
            <div
                className={clsx(
                    'grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8',
                )}
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <BaseCard
                        key={ch.person.slug + ch.anime.slug}
                        href={`/people/${ch.person.slug}`}
                        poster={ch.person.image}
                        title={
                            ch.person.name_ua ||
                            ch.person.name_en ||
                            ch.person.name_native
                        }
                        description={
                            ch.anime[titleLanguage!] ||
                            ch.anime.title_ua ||
                            ch.anime.title_en ||
                            ch.anime.title_ja
                        }
                        disableChildrenLink
                        leftSubtitle={ch.language.toUpperCase()}
                    >
                        <div className="absolute left-0 bottom-0 z-0 h-16 w-full bg-gradient-to-t from-black to-transparent" />
                        <div className="absolute transition-all w-16 hover:w-28 h-auto z-[1] shadow-lg rounded-lg border-secondary/60 border flex right-2 bottom-2">
                            <BaseCard
                                href={`/anime/${ch.anime.slug}`}
                                poster={ch.anime.poster}
                            />
                        </div>
                    </BaseCard>
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
