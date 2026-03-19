import { ContentTypeEnum } from '@hikka/client';
import { zodValidator } from '@tanstack/zod-adapter';
import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { generateHeadMeta } from '@/utils/metadata';
import { Header, HeaderTitle } from '@/components/ui/header';

import { NovelList, NovelListNavbar } from '@/features/novel';
import { ReadFilters } from '@/features/read';
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
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_30%] lg:items-start lg:justify-between lg:gap-12 xl:grid-cols-[1fr_25%]">
            <Block>
                <Header>
                    <HeaderTitle variant="h2">Каталог ранобе</HeaderTitle>
                </Header>
                <NovelListNavbar />
                <NovelList />
            </Block>
            <div className="border-border bg-secondary/20 sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border backdrop-blur-xl lg:order-2 lg:flex">
                <ReadFilters
                    content_type={ContentTypeEnum.NOVEL}
                    sort_type="novel"
                />
            </div>
        </div>
    );
}
