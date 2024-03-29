'use client';

import { useParams } from 'next/navigation';

import EntryCard from '@/components/entry-card/entry-card';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import useFavorites from '@/services/hooks/favorite/useFavorites';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { cn } from '@/utils';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const params = useParams();
    const {
        list,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        ref,
    } = useFavorites<API.Content<'anime'>>({
        username: String(params.username),
        content_type: 'anime',
    });

    if (isPending) {
        return null;
    }

    if (!list && !extended) {
        return null;
    }

    const filteredData = (extended ? list : list?.slice(0, 6)) || [];

    return (
        <>
            {filteredData.length > 0 && (
                <div
                    className={cn(
                        'grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8',
                        !extended &&
                            'grid-min-10 no-scrollbar -mx-4 grid-flow-col grid-cols-scroll-6 overflow-x-auto px-4',
                    )}
                >
                    {filteredData.map((res) => (
                        <EntryCard
                            key={res.slug}
                            watch={
                                res.watch.length > 0 ? res.watch[0] : undefined
                            }
                            title={
                                res[titleLanguage!] ||
                                res.title_ua ||
                                res.title_en ||
                                res.title_ja
                            }
                            poster={res.poster}
                            href={`/anime/${res.slug}`}
                            slug={res.slug}
                            content_type="anime"
                        />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку <span className="font-black">Аніме</span>{' '}
                            пусто
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
        </>
    );
};

export default Component;
