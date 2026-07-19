import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import { MangaCard as MangaCardItem } from '@/components/content-card';
import { ContentListItem } from '@/components/content-list';
import type { StackSize } from '@/components/ui/stack';
import CatalogListView from '@/features/catalog/catalog-list-view';
import { getTitle } from '@/utils/title/get-title';

import { useSessionUI } from '../../auth';
import { useCatalogView } from '../../filters/hooks/use-catalog-view';
import { useMangaSearchQuery } from './use-manga-search-query';

type Props = {
    extendedSize?: StackSize;
    pageSize?: number;
};

const MangaList: FC<Props> = ({ extendedSize = 5, pageSize }) => {
    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
        list,
        pagination,
        queryKey,
    } = useMangaSearchQuery(pageSize);

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
                <MangaCardItem key={item.slug} item={item} />
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
                    type={ContentTypeEnum.MANGA}
                />
            )}
        />
    );
};

export default MangaList;
