import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import { AnimeCard as AnimeCardItem } from '@/components/content-card';
import { ContentListItem } from '@/components/content-list';
import type { StackSize } from '@/components/ui/stack';
import CatalogListView from '@/features/catalog/catalog-list-view';
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

    const { preferences: prefs } = useSessionUI();
    const { view } = useCatalogView('catalog');

    const hasMultiplePages = Boolean(data && data.pages.length > 1);

    return (
        <CatalogListView
            list={list}
            view={view}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            hasMultiplePages={hasMultiplePages}
            pagination={pagination}
            removeQueryKey={queryKey}
            extendedSize={extendedSize}
            renderGridItem={(item) => (
                <AnimeCardItem
                    key={item.slug}
                    item={item}
                    title={getTitle(
                        item,
                        prefs.title_language,
                        prefs.name_language,
                    )}
                />
            )}
            renderListItem={(item) => (
                <ContentListItem
                    key={item.slug}
                    item={item}
                    title={getTitle(
                        item,
                        prefs.title_language,
                        prefs.name_language,
                    )}
                    type={ContentTypeEnum.ANIME}
                />
            )}
        />
    );
};

export default AnimeList;
