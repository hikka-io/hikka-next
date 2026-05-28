import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import Block from '@/components/ui/block';
import { Header, HeaderDescription, HeaderTitle } from '@/components/ui/header';
import type { StackSize } from '@/components/ui/stack';

import { useCatalogView } from '@/features/filters/hooks/use-catalog-view';
import { CatalogNavbar } from '@/features/content';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import { MangaList, MangaListSummary } from '@/features/manga';
import { ReadFilters, ReadFiltersModal } from '@/features/read';

import { cn } from '@/utils/cn';
import { generateHeadMeta } from '@/utils/metadata';
import { mangaSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/manga/')({
    validateSearch: zodValidator(mangaSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Манґа',
            description: 'Каталог манґи — шукайте та фільтруйте манґу на Hikka',
            url: 'https://hikka.io/manga',
        }),
    component: MangaListPage,
});

function MangaListPage() {
    const { visible: sidebarVisible } = useFiltersSidebar();
    const { view } = useCatalogView('manga_catalog');

    const extendedSize: StackSize =
        view === 'list' ? 1 : sidebarVisible ? 5 : 7;
    const pageSize = view === 'list' ? undefined : extendedSize * 4;

    return (
        <Block>
            <Header className="flex-col items-start gap-1">
                <HeaderTitle variant="h2">Каталог манґи</HeaderTitle>
                <HeaderDescription>
                    Знайдіть манґу за жанрами, роком та іншими фільтрами
                </HeaderDescription>
            </Header>

            <div
                className={cn(
                    'grid grid-cols-1 lg:items-start lg:gap-8',
                    sidebarVisible &&
                        'lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%]',
                )}
            >
                <div className="flex flex-col gap-4">
                    <CatalogNavbar
                        sort_type="manga"
                        content_type={ContentTypeEnum.MANGA}
                        searchPlaceholder="Введіть назву манґи..."
                        renderFilterModal={({ open, onOpenChange }) => (
                            <ReadFiltersModal
                                open={open}
                                onOpenChange={onOpenChange}
                                content_type={ContentTypeEnum.MANGA}
                                sort_type="manga"
                            />
                        )}
                    />
                    <MangaListSummary pageSize={pageSize} />
                    <MangaList
                        extendedSize={extendedSize}
                        pageSize={pageSize}
                    />
                </div>

                {sidebarVisible && (
                    <div className="border-border bg-secondary/20 sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border backdrop-blur-xl lg:order-2 lg:flex">
                        <ReadFilters
                            content_type={ContentTypeEnum.MANGA}
                            sort_type="manga"
                        />
                    </div>
                )}
            </div>
        </Block>
    );
}
