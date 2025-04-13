import { Metadata } from 'next';

import getMangaInfo, {
    Response as MangaResponse,
} from '../../../../../services/api/manga/getMangaInfo';
import _generateMetadata from '../../../../../utils/generate-metadata';
import parseTextFromMarkDown from '../../../../../utils/parse-text-from-markdown';
import truncateText from '../../../../../utils/truncate-text';

export interface MetadataProps {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const slug = params.slug;

    const manga: MangaResponse = await getMangaInfo({ params: { slug } });

    const startDate = manga.start_date
        ? new Date(manga.start_date * 1000).getFullYear()
        : null;
    const title =
        (manga.title_ua || manga.title_en || manga.title_original) +
        (startDate ? ` (${startDate})` : '');
    let synopsis: string | null = truncateText(
        parseTextFromMarkDown(manga.synopsis_ua || manga.synopsis_en),
        150,
        true,
    );

    return _generateMetadata({
        title: {
            default: title,
            template: `%s / ${title} / Hikka`,
        },
        description: synopsis,
        images: `https://preview.hikka.io/manga/${slug}/${manga.updated}`,
        other: {
            'mal-id': manga.mal_id,
        },
    });
}
