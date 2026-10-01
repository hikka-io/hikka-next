import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import { CatalogPage } from '@/features/catalog';
import { loadCatalogFirstPage } from '@/features/catalog/queries';
import { generateHeadMeta } from '@/utils/metadata';
import { animeSearchSchema } from '@/utils/search-schemas';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/anime/')({
    validateSearch: zodValidator(animeSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: ({ context, deps, preload }) =>
        loadCatalogFirstPage(
            { contentType: ContentTypeEnum.ANIME, search: deps, preload },
            context,
        ),
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
