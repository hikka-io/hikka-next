import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import { CatalogPage } from '@/features/catalog';
import { generateHeadMeta } from '@/utils/metadata';
import { novelSearchSchema } from '@/utils/search-schemas';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/novel/')({
    validateSearch: zodValidator(novelSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Ранобе',
            description:
                'Каталог ранобе — шукайте та фільтруйте ранобе на Hikka',
            url: `${SITE_ORIGIN}/novel`,
        }),
    component: NovelListPage,
});

function NovelListPage() {
    return (
        <CatalogPage
            contentType={ContentTypeEnum.NOVEL}
            title="Каталог ранобе"
            searchPlaceholder="Введіть назву ранобе..."
        />
    );
}
