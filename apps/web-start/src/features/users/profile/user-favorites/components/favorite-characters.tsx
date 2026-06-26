import type { ComponentProps, FC } from 'react';

import {
    ContentTypeEnum,
    type FavouriteCharacterResponse,
    favouriteListInfiniteOptions,
} from '@hikka/api';
import { useSessionUI } from '@/services/hooks/use-session-ui';
import { getTitle } from '@/utils/title/get-title';

import ContentCard from '@/components/content-card/content-card';
import LoadMoreButton from '@/components/load-more-button';
import NotFound from '@/components/ui/not-found';
import Stack from '@/components/ui/stack';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

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
                            content_type={
                                // TODO(phase2): drop cast once content-card is on @hikka/api
                                ContentTypeEnum.CHARACTER as unknown as ComponentProps<
                                    typeof ContentCard
                                >['content_type']
                            }
                            slug={res.slug}
                        />
                    ))}
                </Stack>
            )}
            {filteredData.length === 0 && (
                <NotFound
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
