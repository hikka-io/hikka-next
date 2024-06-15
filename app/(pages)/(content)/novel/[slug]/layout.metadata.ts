import { Metadata } from 'next';

import getNovelInfo, {
    Response as NovelResponse,
} from '@/services/api/novel/getNovelInfo';
import _generateMetadata from '@/utils/generate-metadata';
import parseTextFromMarkDown from '@/utils/parse-text-from-markdown';
import truncateText from '@/utils/truncate-text';

export interface MetadataProps {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const slug = params.slug;

    const novel: NovelResponse = await getNovelInfo({ params: { slug } });

    const startDate = novel.start_date
        ? new Date(novel.start_date * 1000).getFullYear()
        : null;
    const title =
        (novel.title_ua || novel.title_en || novel.title_original) +
        (startDate ? ` (${startDate})` : '');
    let synopsis: string | null = truncateText(
        parseTextFromMarkDown(novel.synopsis_ua || novel.synopsis_en),
        150,
        true,
    );

    return _generateMetadata({
        title: {
            default: title,
            template: title + ' / %s / Hikka',
        },
        description: synopsis,
        images: `https://preview.hikka.io/anime/${slug}/${novel.updated}`,
        other: {
            'mal-id': novel.mal_id,
        },
    });
}
