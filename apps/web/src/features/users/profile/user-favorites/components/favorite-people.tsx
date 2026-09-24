import type { FC } from 'react';

import {
    ContentTypeEnum,
    type FavouritePersonResponse,
    favouriteListInfiniteOptions,
} from '@hikka/api';

import EntityCard from '@/components/content-card/entity-card';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import Stack from '@/components/ui/stack';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

import FavoriteMoreCard from './favorite-more-card';
import { favoritePreview } from './favorite-preview';
import FavoriteSkeleton from './favorite-skeleton';

type Props = {
    extended?: boolean;
};

const People: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { preferences } = useSessionUI();
    const {
        list: rawList,
        pagination,
        isPending,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        ref,
    } = useInfiniteList(
        favouriteListInfiniteOptions({
            path: {
                content_type: ContentTypeEnum.PERSON,
                username: String(params.username),
            },
        }),
    );

    const list = rawList as FavouritePersonResponse[] | undefined;

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
                        <EntityCard
                            key={res.slug}
                            entity={{
                                type: ContentTypeEnum.PERSON,
                                data: res,
                            }}
                            title={getTitle(
                                res,
                                preferences.title_language,
                                preferences.name_language,
                            )}
                        />
                    ))}
                    {remainingCount > 0 && (
                        <FavoriteMoreCard
                            count={remainingCount}
                            image={remainingItem?.image}
                            username={String(params.username)}
                            type={ContentTypeEnum.PERSON}
                        />
                    )}
                </Stack>
            )}
            {filteredData.length === 0 && (
                <EmptyState
                    bordered
                    icon={<MaterialSymbolsPerson />}
                    title={
                        <span>
                            У списку <span className="font-black">Люди</span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після того, як сюди буде додано людей"
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

export default People;
