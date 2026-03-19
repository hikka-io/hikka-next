import { ContentTypeEnum } from '@hikka/client';
import { zodValidator } from '@tanstack/zod-adapter';
import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { generateHeadMeta } from '@/utils/metadata';
import { Header, HeaderTitle } from '@/components/ui/header';

import { MangaList, MangaListNavbar } from '@/features/manga';
import { ReadFilters } from '@/features/read';
import { mangaSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/manga/')({
    validateSearch: zodValidator(mangaSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Манґа',
            description:
                'Каталог манґи — шукайте та фільтруйте манґу на Hikka',
            url: 'https://hikka.io/manga',
        }),
    component: MangaListPage,
});

function MangaListPage() {
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_30%] lg:items-start lg:justify-between lg:gap-12 xl:grid-cols-[1fr_25%]">
            <Block>
                <Header>
                    <HeaderTitle variant="h2">Каталог манґи</HeaderTitle>
                </Header>
                <MangaListNavbar />
                <MangaList />
            </Block>
            <div className="border-border bg-secondary/20 sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border backdrop-blur-xl lg:order-2 lg:flex">
                <ReadFilters
                    content_type={ContentTypeEnum.MANGA}
                    sort_type="manga"
                />
            </div>
        </div>
    );
}
