'use client';

import clsx from 'clsx';

import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import BaseCard from '@/components/ui/base-card';
import { Button } from '@/components/ui/button';
import useCharacters from '@/services/hooks/anime/useCharacters';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacters({ slug: String(params.slug) });

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
                </div>
            )}
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
