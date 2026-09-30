import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import { CatalogPage } from '@/features/catalog';
import { loadCatalogFirstPage } from '@/features/catalog/queries';
import { generateHeadMeta } from '@/utils/metadata';
import { mangaSearchSchema } from '@/utils/search-schemas';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/manga/')({
    validateSearch: zodValidator(mangaSearchSchema),
    loaderDeps: ({ search }) => ({ search }),
    loader: ({ context, deps: { search }, preload }) =>
        loadCatalogFirstPage(
            { contentType: ContentTypeEnum.MANGA, search, preload },
            context,
        ),
    head: () =>
        generateHeadMeta({
            title: 'Манґа',
            description: 'Каталог манґи — шукайте та фільтруйте манґу на Hikka',
            url: `${SITE_ORIGIN}/manga`,
        }),
    component: MangaListPage,
});

function MangaListPage() {
    return (
        <CatalogPage
            contentType={ContentTypeEnum.MANGA}
            title="Каталог манґи"
            searchPlaceholder="Введіть назву манґи..."
        />
    );
}
