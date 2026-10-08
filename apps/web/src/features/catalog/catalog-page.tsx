import type { FC } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import ContentTypeTabs from '@/components/content-type-tabs';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import {
    AnimeFilters,
    AnimeFiltersModal,
    FiltersSidebarLayout,
    HeaderFiltersButton,
    ReadFilters,
    ReadFiltersModal,
    type RenderFiltersModal,
} from '@/features/filters';
import { useUiPreferences } from '@/services/ui-preferences-store';

import CatalogList from './catalog-list';
import CatalogListSummary from './catalog-list-summary';
import CatalogNavbar from './catalog-navbar';
import { CATALOG_VIEW_KEY, catalogColumns, catalogPageSize } from './queries';

type Props = {
    contentType: MainContentTypeEnum;
    title: string;
    searchPlaceholder: string;
};

const CatalogPage: FC<Props> = ({ contentType, title, searchPlaceholder }) => {
    const titleAnchor = usePageTitleAnchor();

    const renderFiltersModal: RenderFiltersModal = (props) =>
        contentType === ContentTypeEnum.ANIME ? (
            <AnimeFiltersModal {...props} sort_type="anime" />
        ) : (
            <ReadFiltersModal
                {...props}
                content_type={contentType}
                sort_type={contentType}
            />
        );

    usePageHeader({
        title,
        parent: '/',
        anchored: true,
        actionsAnchored: true,
        hideBack: true,
        actionsComponent: () => (
            <HeaderFiltersButton renderModal={renderFiltersModal} />
        ),
    });

    const extendedSize = useUiPreferences((prefs) =>
        catalogColumns(prefs, CATALOG_VIEW_KEY),
    );
    const pageSize = useUiPreferences((prefs) =>
        catalogPageSize(prefs, CATALOG_VIEW_KEY),
    );

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle ref={titleAnchor} variant="h2">
                        {title}
                    </HeaderTitle>
                </HeaderContainer>
            </Header>
            <ContentTypeTabs
                value={contentType}
                urlFor={(type) => `/${type}`}
                className="md:hidden"
            />

            <FiltersSidebarLayout
                sidebar={
                    contentType === ContentTypeEnum.ANIME ? (
                        <AnimeFilters
                            content_type={ContentTypeEnum.ANIME}
                            sort_type="anime"
                        />
                    ) : (
                        <ReadFilters
                            content_type={contentType}
                            sort_type={contentType}
                        />
                    )
                }
            >
                <CatalogNavbar
                    sort_type={contentType}
                    content_type={contentType}
                    searchPlaceholder={searchPlaceholder}
                    renderFilterModal={renderFiltersModal}
                />
                <CatalogListSummary
                    contentType={contentType}
                    pageSize={pageSize}
                />
                <CatalogList
                    contentType={contentType}
                    extendedSize={extendedSize}
                    pageSize={pageSize}
                />
            </FiltersSidebarLayout>
        </Block>
    );
};

export default CatalogPage;
