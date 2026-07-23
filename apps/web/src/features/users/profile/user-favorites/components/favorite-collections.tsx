import type { FC } from 'react';

import {
    ContentTypeEnum,
    type FavouriteCollectionResponse,
    favouriteListInfiniteOptions,
} from '@hikka/api';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import Stack from '@/components/ui/stack';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import FavoriteSkeleton from './favorite-skeleton';

type Props = {
    extended?: boolean;
};

const Collections: FC<Props> = ({ extended }) => {
    const params = useParams();
    const {
        list: rawList,
        isPending,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        ref,
    } = useInfiniteList(
        favouriteListInfiniteOptions({
            path: {
                content_type: ContentTypeEnum.COLLECTION,
                username: String(params.username),
            },
        }),
    );

    const list = rawList as FavouriteCollectionResponse[] | undefined;

    if (isPending) {
        return <FavoriteSkeleton extended={extended} />;
    }

    if (!list && !extended) {
        return null;
    }

    const filteredData = (extended ? list : list?.slice(0, 6)) || [];

    return (
        <>
            {filteredData.length > 0 && (
                <Stack
                    extended={extended}
                    size={6}
                    extendedSize={7}
                    className="grid-min-10"
                    imagePreset="cardSm"
                >
                    {filteredData.map((res) => (
                        <ContentCard
                            key={res.reference}
                            title={res.title}
                            image={res.collection[0].content.image}
                            to={`/collections/${res.reference}`}
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
                </Stack>
            )}
            {filteredData.length === 0 && (
                <EmptyState
                    bordered
                    icon={<MaterialSymbolsGridViewRounded />}
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">Колекції</span> пусто
                        </span>
                    }
                    description="Цей список оновиться після того, як сюди буде додано колекції"
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
