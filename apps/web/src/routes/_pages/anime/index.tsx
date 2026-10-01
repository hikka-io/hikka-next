import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import { CatalogPage } from '@/features/catalog';
import { generateHeadMeta } from '@/utils/metadata';
import { animeSearchSchema } from '@/utils/search-schemas';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/anime/')({
    validateSearch: zodValidator(animeSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Аніме',
            description:
                'Каталог аніме — шукайте та фільтруйте аніме серіали на Hikka',
            url: `${SITE_ORIGIN}/anime`,
        }),
    component: AnimeListPage,
});

function AnimeListPage() {
    return (
        <CatalogPage
            contentType={ContentTypeEnum.ANIME}
            title="Каталог аніме"
            searchPlaceholder="Введіть назву аніме..."
        />
    );
}
