import type { FC } from 'react';

import {
    ContentTypeEnum,
    type FavouriteNovelResponse,
    favouriteListInfiniteOptions,
} from '@hikka/api';

import NovelCard from '@/components/content-card/novel-card';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import Stack from '@/components/ui/stack';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import FavoriteMoreCard from './favorite-more-card';
import { favoritePreview } from './favorite-preview';
import FavoriteSkeleton from './favorite-skeleton';

type Props = {
    extended?: boolean;
};

const Novel: FC<Props> = ({ extended }) => {
    const params = useParams();
    const {
        list: rawList,
        pagination,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        ref,
    } = useInfiniteList(
        favouriteListInfiniteOptions({
            path: {
                content_type: ContentTypeEnum.NOVEL,
                username: String(params.username),
            },
        }),
    );

    const list = rawList as FavouriteNovelResponse[] | undefined;

    if (isPending) {
        return <FavoriteSkeleton extended={extended} />;
    }

    if (!list && !extended) {
        return null;
    }

    const {
        items: filteredData,
        remainingCount,
        remainingItem,
    } = favoritePreview(list, pagination?.total ?? 0, extended);

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
                        <NovelCard key={res.slug} item={res} />
                    ))}
                    {remainingCount > 0 && (
                        <FavoriteMoreCard
                            count={remainingCount}
                            image={remainingItem?.image}
                            username={String(params.username)}
                            type={ContentTypeEnum.NOVEL}
                        />
                    )}
                </Stack>
            )}
            {filteredData.length === 0 && (
                <EmptyState
                    bordered
                    icon={<MaterialSymbolsMenuBookRounded />}
                    title={
                        <span>
                            У списку <span className="font-black">Ранобе</span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після того, як сюди буде додано ранобе"
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
