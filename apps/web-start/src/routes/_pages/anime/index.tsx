import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import Block from '@/components/ui/block';
import { Header, HeaderDescription, HeaderTitle } from '@/components/ui/header';
import type { StackSize } from '@/components/ui/stack';

import { AnimeList, AnimeListSummary } from '@/features/anime';
import { useCatalogView } from '@/features/filters/hooks/use-catalog-view';
import { CatalogNavbar } from '@/features/content';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import { AnimeFilters, AnimeFiltersModal } from '@/features/watch';

import { cn } from '@/utils/cn';
import { generateHeadMeta } from '@/utils/metadata';
import { animeSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/anime/')({
    validateSearch: zodValidator(animeSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Аніме',
            description:
                'Каталог аніме — шукайте та фільтруйте аніме серіали на Hikka',
            url: 'https://hikka.io/anime',
        }),
    component: AnimeListPage,
});

function AnimeListPage() {
    const { visible: sidebarVisible } = useFiltersSidebar();
    const { view } = useCatalogView();

    const extendedSize: StackSize =
        view === 'list' ? 1 : sidebarVisible ? 5 : 7;
    // Desktop cols × 4 rows; always even so mobile (grid-cols-2) fills
    // without empty cells. List view uses the default API page size.
    const pageSize = view === 'list' ? undefined : extendedSize * 4;

    return (
        <Block>
            <Header className="flex-col items-start gap-1">
                <HeaderTitle variant="h2">Каталог аніме</HeaderTitle>
                <HeaderDescription>
                    Знайдіть аніме за жанрами, роком та іншими фільтрами
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
                        sort_type="anime"
                        content_type={ContentTypeEnum.ANIME}
                        searchPlaceholder="Введіть назву аніме..."
                        renderFilterModal={({ open, onOpenChange }) => (
                            <AnimeFiltersModal
                                open={open}
                                onOpenChange={onOpenChange}
                                sort_type="anime"
                            />
                        )}
                    />
                    <AnimeListSummary pageSize={pageSize} />
                    <AnimeList
                        extendedSize={extendedSize}
                        pageSize={pageSize}
                    />
                </div>

                {sidebarVisible && (
                    <div className="border-border bg-secondary/20 sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border backdrop-blur-xl lg:order-2 lg:flex">
                        <AnimeFilters
                            content_type={ContentTypeEnum.ANIME}
                            sort_type="anime"
                        />
                    </div>
                )}
            </div>
        </Block>
    );
}
