'use client';

import { ContentTypeEnum, FavouriteNovelResponse } from '@hikka/client';
import { useUserFavourites } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import NovelCard from '@/components/novel-card';
import NotFound from '@/components/ui/not-found';

import { cn } from '@/utils/utils';

interface Props {
    extended?: boolean;
}

const Novel: FC<Props> = ({ extended }) => {
    const params = useParams();
    const {
        list,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        ref,
    } = useUserFavourites<FavouriteNovelResponse>({
        contentType: ContentTypeEnum.NOVEL,
        username: String(params.username),
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
                        <NovelCard key={res.slug} novel={res} />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку <span className="font-black">Ранобе</span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після того як сюди буде додано ранобе"
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

export default Novel;
