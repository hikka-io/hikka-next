import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';

import { MangaList, MangaListNavbar } from '@/features/manga';
import { ReadFilters } from '@/features/read';

export const Route = createFileRoute('/_pages/manga/')({
    head: () => ({
        meta: [{ title: 'Манґа / Hikka' }],
    }),
    component: MangaListPage,
});

function MangaListPage() {
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-12">
            <Block>
                <Header>
                    <HeaderTitle variant="h2">Каталог манґи</HeaderTitle>
                </Header>
                <MangaListNavbar />
                <MangaList />
            </Block>
            <div className="sticky top-20 order-1 hidden w-full max-h-[calc(100vh-9rem)] rounded-lg border border-border bg-secondary/20 backdrop-blur-xl overflow-hidden lg:order-2 lg:flex">
                <ReadFilters
                    content_type={ContentTypeEnum.MANGA}
                    sort_type="manga"
                />
            </div>
        </div>
    );
}
