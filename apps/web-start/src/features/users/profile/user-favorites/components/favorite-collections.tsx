'use client';

import { ContentTypeEnum, FavouriteCollectionResponse } from '@hikka/client';
import { useUserFavourites } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import LoadMoreButton from '@/components/load-more-button';
import NotFound from '@/components/ui/not-found';

import { cn } from '@/utils/cn';

interface Props {
    extended?: boolean;
}

const Collections: FC<Props> = ({ extended }) => {
    const params = useParams();
    const {
        list,
        isPending,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        ref,
    } = useUserFavourites<FavouriteCollectionResponse>({
        username: String(params.username),
        contentType: ContentTypeEnum.COLLECTION,
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
                            key={res.reference}
                            title={res.title}
                            image={res.collection[0].content.image}
                            href={`/collections/${res.reference}`}
                            titleClassName={cn(
                                res.spoiler && 'blur hover:blur-none',
                            )}
                            containerClassName={cn(
                                res.nsfw && 'blur hover:blur-none',
                            )}
                            leftSubtitle={(res.nsfw && '+18') || undefined}
                            rightSubtitle={
                                (res.spoiler && 'Спойлери') || undefined
                            }
                        />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">Колекції</span> пусто
                        </span>
                    }
                    description="Цей список оновиться після того як сюди буде додано колекції"
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

export default Collections;
