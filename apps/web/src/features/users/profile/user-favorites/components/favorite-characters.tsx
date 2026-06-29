import type { FC } from 'react';

import {
    ContentTypeEnum,
    type FavouriteCharacterResponse,
    favouriteListInfiniteOptions,
} from '@hikka/api';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsPerson2OutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPerson2OutlineRounded';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import Stack from '@/components/ui/stack';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

type Props = {
    extended?: boolean;
};

const Characters: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { preferences } = useSessionUI();
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
                content_type: ContentTypeEnum.CHARACTER,
                username: String(params.username),
            },
        }),
    );

    const list = rawList as FavouriteCharacterResponse[] | undefined;

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
                <Stack
                    extended={extended}
                    size={6}
                    extendedSize={6}
                    className="grid-min-10"
                    imagePreset="cardSm"
                >
                    {filteredData.map((res) => (
                        <ContentCard
                            key={res.slug}
                            title={getTitle(
                                res,
                                preferences.title_language,
                                preferences.name_language,
                            )}
                            image={res.image}
                            to={`/characters/${res.slug}`}
                            content_type={ContentTypeEnum.CHARACTER}
                            slug={res.slug}
                        />
                    ))}
                </Stack>
            )}
            {filteredData.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsPerson2OutlineRounded />}
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">Персонажі</span> пусто
                        </span>
                    }
                    description="Цей список оновиться після того, як сюди буде додано персонажів"
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

export default Characters;
