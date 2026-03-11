import { ContentTypeEnum } from '@hikka/client';
import { zodValidator } from '@tanstack/zod-adapter';
import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';

import { AnimeList, AnimeListNavbar } from '@/features/anime';
import { AnimeFilters } from '@/features/watch';
import { animeSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/anime/')({
    validateSearch: zodValidator(animeSearchSchema),
    head: () => ({
        meta: [{ title: 'Аніме / Hikka' }],
    }),
    component: AnimeListPage,
});

function AnimeListPage() {
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-12">
            <Block>
                <Header>
                    <HeaderTitle variant="h2">Каталог аніме</HeaderTitle>
                </Header>
                <AnimeListNavbar />
                <AnimeList />
            </Block>
            <div className="sticky top-20 order-1 hidden w-full max-h-[calc(100vh-9rem)] rounded-lg border border-border bg-secondary/20 backdrop-blur-xl overflow-hidden lg:order-2 lg:flex">
                <AnimeFilters
                    content_type={ContentTypeEnum.ANIME}
                    sort_type="anime"
                />
            </div>
        </div>
    );
}
