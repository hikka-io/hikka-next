import type { FC, ReactNode } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { AnimeCard, MangaCard, NovelCard } from '@/components/content-card';
import type { StackSize } from '@/components/ui/stack';
import { useSessionUI } from '@/services/session';
import { getTitle } from '@/utils/title/get-title';

import CatalogListItem from './catalog-list-item';
import CatalogListView from './catalog-list-view';
import {
    type CatalogItems,
    useCatalogSearchQuery,
} from './use-catalog-search-query';
import { useCatalogView } from './use-catalog-view';

type CatalogItemRenderers<T> = {
    renderGridItem(item: T): ReactNode;
    renderListItem(item: T, title: string): ReactNode;
};

const CATALOG_ITEM_RENDERERS = {
    [ContentTypeEnum.ANIME]: {
        renderGridItem: (item) => <AnimeCard key={item.slug} item={item} />,
        renderListItem: (item, title) => (
            <CatalogListItem
                key={item.slug}
                item={item}
                title={title}
                type={ContentTypeEnum.ANIME}
            />
        ),
    },
    [ContentTypeEnum.MANGA]: {
        renderGridItem: (item) => <MangaCard key={item.slug} item={item} />,
        renderListItem: (item, title) => (
            <CatalogListItem
                key={item.slug}
                item={item}
                title={title}
                type={ContentTypeEnum.MANGA}
            />
        ),
    },
    [ContentTypeEnum.NOVEL]: {
        renderGridItem: (item) => <NovelCard key={item.slug} item={item} />,
        renderListItem: (item, title) => (
            <CatalogListItem
                key={item.slug}
                item={item}
                title={title}
                type={ContentTypeEnum.NOVEL}
            />
        ),
    },
} satisfies {
    [K in MainContentTypeEnum]: CatalogItemRenderers<CatalogItems[K]>;
};

type Props = {
    contentType: MainContentTypeEnum;
    extendedSize?: StackSize;
    pageSize?: number;
};

const CatalogList: FC<Props> = ({
    contentType,
    extendedSize = 5,
    pageSize,
}) => {
    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
        list,
        pagination,
        queryKey,
    } = useCatalogSearchQuery(contentType, pageSize);

    const { preferences: prefs } = useSessionUI();
    const { view } = useCatalogView('catalog');

    const renderers: CatalogItemRenderers<CatalogItems[MainContentTypeEnum]> =
        CATALOG_ITEM_RENDERERS[contentType];
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
            renderGridItem={renderers.renderGridItem}
            renderListItem={(item) =>
                renderers.renderListItem(
                    item,
                    getTitle(item, prefs.title_language, prefs.name_language),
                )
            }
        />
    );
};

export default CatalogList;
