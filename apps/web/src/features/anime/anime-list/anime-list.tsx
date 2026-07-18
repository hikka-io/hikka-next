import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import CatalogListSkeleton from '@/components/catalog-list-skeleton';
import { AnimeCard as AnimeCardItem } from '@/components/content-card';
import { ContentListItem } from '@/components/content-list';
import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import { StickyPagination } from '@/components/ui/pagination';
import type { StackSize } from '@/components/ui/stack';
import Stack from '@/components/ui/stack';
import { getTitle } from '@/utils/title/get-title';
import { useSessionUI } from '../../auth';
import { useCatalogView } from '../../filters/hooks/use-catalog-view';

import { useAnimeSearchQuery } from './use-anime-search-query';

type Props = {
    extendedSize?: StackSize;
    pageSize?: number;
};

const AnimeList: FC<Props> = ({ extendedSize = 5, pageSize }) => {
    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
        list,
        pagination,
        queryKey,
    } = useAnimeSearchQuery(pageSize);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { preferences: prefs } = useSessionUI();
    const { view } = useCatalogView('catalog');

    const hasMultiplePages = Boolean(data && data.pages.length > 1);

    const handlePageChange = (newPage: number) => {
        if (hasMultiplePages) {
            queryClient.removeQueries({ queryKey });
        }

        navigate({
            to: '.',
            search: (prev) => ({ ...prev, page: newPage }),
        });
    };

    if (isLoading && !isFetchingNextPage) {
        return <CatalogListSkeleton extendedSize={extendedSize} />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <div className="isolate flex flex-col gap-6">
            {view === 'grid' ? (
                <Stack extended size={5} extendedSize={extendedSize}>
                    {list.map((item) => {
                        const title = getTitle(
                            item,
                            prefs.title_language,
                            prefs.name_language,
                        );

                        return (
                            <AnimeCardItem
                                key={item.slug}
                                item={item}
                                title={title}
                            />
                        );
                    })}
                </Stack>
            ) : (
                list.map((item) => {
                    const title = getTitle(
                        item,
                        prefs.title_language,
                        prefs.name_language,
                    );

                    return (
                        <ContentListItem
                            key={item.slug}
                            item={item}
                            title={title}
                            type={ContentTypeEnum.ANIME}
                        />
                    );
                })
            )}

            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                />
            )}
            {pagination && (
                <StickyPagination
                    page={pagination.page}
                    pages={pagination.pages}
                    setPage={handlePageChange}
                />
            )}
        </div>
    );
};

export default AnimeList;
