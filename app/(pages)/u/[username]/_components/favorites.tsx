'use client';

import { useParams } from 'next/navigation';

import AnimeCard from '@/components/anime-card';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import useFavorites from '@/services/hooks/favorite/useFavorites';
import { useSettingsContext } from '@/services/providers/settings-provider';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useFavorites({ username: String(params.username) });

    if ((!list || list.length === 0) && !extended) {
        return null;
    }

    const filteredData = (extended ? list : list?.slice(0, 6)) || [];

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Улюблені"
                href={
                    !extended
                        ? '/u/' + params.username + '/favorites'
                        : undefined
                }
            />
            {filteredData.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8">
                    {filteredData.map((res) => (
                        <AnimeCard
                            key={res.reference}
                            watch={
                                res.anime.watch.length > 0
                                    ? res.anime.watch[0]
                                    : undefined
                            }
                            title={
                                res.anime[titleLanguage!] ||
                                res.anime.title_ua ||
                                res.anime.title_en ||
                                res.anime.title_ja
                            }
                            poster={res.anime.poster}
                            href={'/anime/' + res.anime.slug}
                            slug={res.anime.slug}
                        />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">Улюблені</span> пусто
                        </span>
                    }
                    description="Цей список оновиться після як сюди буде додано аніме"
                />
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
