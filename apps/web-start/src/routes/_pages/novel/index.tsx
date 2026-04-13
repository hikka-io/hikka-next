import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import Block from '@/components/ui/block';
import { Header, HeaderDescription, HeaderTitle } from '@/components/ui/header';
import type { StackSize } from '@/components/ui/stack';

import { useCatalogView } from '@/features/filters/hooks/use-catalog-view';
import { CatalogNavbar } from '@/features/content';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import { NovelList, NovelListSummary } from '@/features/novel';
import { ReadFilters, ReadFiltersModal } from '@/features/read';

import { cn } from '@/utils/cn';
import { generateHeadMeta } from '@/utils/metadata';
import { novelSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/novel/')({
    validateSearch: zodValidator(novelSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Ранобе',
            description:
                'Каталог ранобе — шукайте та фільтруйте ранобе на Hikka',
            url: 'https://hikka.io/novel',
        }),
    component: NovelListPage,
});

function NovelListPage() {
    const { visible: sidebarVisible } = useFiltersSidebar();
    const { view } = useCatalogView('novel_catalog');

    const extendedSize: StackSize =
        view === 'list' ? 1 : sidebarVisible ? 5 : 7;
    const pageSize = view === 'list' ? undefined : extendedSize * 4;

    return (
        <Block>
            <Header className="flex-col items-start gap-1">
                <HeaderTitle variant="h2">Каталог ранобе</HeaderTitle>
                <HeaderDescription>
                    Знайдіть ранобе за жанрами, роком та іншими фільтрами
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
                        sort_type="novel"
                        content_type={ContentTypeEnum.NOVEL}
                        searchPlaceholder="Введіть назву ранобе..."
                        renderFilterModal={({ open, onOpenChange }) => (
                            <ReadFiltersModal
                                open={open}
                                onOpenChange={onOpenChange}
                                content_type={ContentTypeEnum.NOVEL}
                                sort_type="novel"
                            />
                        )}
                    />
                    <NovelListSummary pageSize={pageSize} />
                    <NovelList
                        extendedSize={extendedSize}
                        pageSize={pageSize}
                    />
                </div>

                {sidebarVisible && (
                    <div className="border-border bg-secondary/20 sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border backdrop-blur-xl lg:order-2 lg:flex">
                        <ReadFilters
                            content_type={ContentTypeEnum.NOVEL}
                            sort_type="novel"
                        />
                    </div>
                )}
            </div>
        </Block>
    );
}
