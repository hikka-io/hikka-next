'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import LoadMoreButton from '@/components/load-more-button';
import NotFound from '@/components/ui/not-found';

import useFavorites from '@/services/hooks/favorite/use-favorites';
import { cn } from '@/utils/utils';

interface Props {
    extended?: boolean;
}

const Manga: FC<Props> = ({ extended }) => {
    const params = useParams();
    const {
        list,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        ref,
    } = useFavorites<API.MangaInfo>({
        username: String(params.username),
        content_type: 'manga',
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
                            'grid-min-10 no-scrollbar -mx-4 auto-cols-scroll grid-flow-col grid-cols-scroll overflow-x-auto px-4',
                    )}
                >
                    {filteredData.map((res) => (
                        <ContentCard
                            key={res.slug}
                            // read={res.read.length > 0 ? res.read[0] : undefined}
                            title={res.title}
                            image={res.image}
                            href={`/manga/${res.slug}`}
                            slug={res.slug}
                            content_type="manga"
                        />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку <span className="font-black">Манґа</span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після того як сюди буде додано аніме"
                />
            )}
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </>
    );
};

export default Manga;