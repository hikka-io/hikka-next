import { ContentTypeEnum } from '@hikka/client';
import { zodValidator } from '@tanstack/zod-adapter';
import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { generateHeadMeta } from '@/utils/metadata';
import { Header, HeaderTitle } from '@/components/ui/header';

import { AnimeList, AnimeListNavbar } from '@/features/anime';
import { AnimeFilters } from '@/features/watch';
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
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_30%] lg:items-start lg:justify-between lg:gap-12 xl:grid-cols-[1fr_25%]">
            <Block>
                <Header>
                    <HeaderTitle variant="h2">Каталог аніме</HeaderTitle>
                </Header>
                <AnimeListNavbar />
                <AnimeList />
            </Block>
            <div className="border-border bg-secondary/20 sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border backdrop-blur-xl lg:order-2 lg:flex">
                <AnimeFilters
                    content_type={ContentTypeEnum.ANIME}
                    sort_type="anime"
                />
            </div>
        </div>
    );
}
