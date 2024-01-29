'use client';

import clsx from 'clsx';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useParams } from 'next/navigation';

import BaseCard from '@/app/_components/base-card';
import SubHeader from '@/app/_components/sub-header';
import { Button } from '@/app/_components/ui/button';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import useInfiniteList from '@/utils/hooks/useInfiniteList';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteList({
            queryKey: ['characters', params.slug],
            queryFn: ({ pageParam = 1 }) =>
                getAnimeCharacters({
                    slug: String(params.slug),
                    page: pageParam,
                }),
        });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    if (!list || list.length === 0) {
        return null;
    }

    const main = list.filter((ch) => ch.main);
    const other = list.filter((ch) => !ch.main);

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-8">
                <SubHeader
                    title={'Головні Персонажі'}
                    href={!extended ? params.slug + '/characters' : undefined}
                />
                <div
                    className={clsx(
                        'grid grid-cols-3 gap-4 md:grid-cols-5 lg:gap-8',
                        extended && 'md:grid-cols-6',
                    )}
                >
                    {(extended ? main : main.slice(0, 5)).map((ch) => (
                        <BaseCard
                            key={ch.character.slug}
                            href={`/characters/${ch.character.slug}`}
                            poster={ch.character.image}
                            title={
                                ch.character.name_ua ||
                                ch.character.name_en ||
                                ch.character.name_ja
                            }
                            posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                        />
                    ))}
                </div>
            </div>
            {extended && other.length > 0 && (
                <div className="flex flex-col gap-8">
                    <SubHeader title={'Другорядні Персонажі'} />
                    <div
                        className={clsx(
                            'grid grid-cols-3 gap-4 md:grid-cols-5 lg:gap-8',
                            extended && 'md:grid-cols-6',
                        )}
                    >
                        {other.map((ch) => (
                            <BaseCard
                                key={ch.character.slug}
                                href={`/characters/${ch.character.slug}`}
                                poster={ch.character.image}
                                title={
                                    ch.character.name_ua ||
                                    ch.character.name_en ||
                                    ch.character.name_ja
                                }
                                posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                            />
                        ))}
                    </div>
                    {hasNextPage && (
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
            )}
        </div>
    );
};

export default Component;