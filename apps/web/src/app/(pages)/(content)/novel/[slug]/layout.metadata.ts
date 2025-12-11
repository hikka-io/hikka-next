import { NovelInfoResponse } from '@hikka/client';
import { getHikkaClient } from '@hikka/react/core';
import { Metadata } from 'next';

import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateMetadata as _generateMetadata } from '@/utils/metadata';
import { truncateText } from '@/utils/text';

export interface MetadataProps {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const slug = params.slug;
    const client = getHikkaClient();
    const novel: NovelInfoResponse = await client.novel.getNovelBySlug(slug);

    const startDate = novel.start_date
        ? new Date(novel.start_date * 1000).getFullYear()
        : null;
    const title =
        (novel.title_ua || novel.title_en || novel.title_original) +
        (startDate ? ` (${startDate})` : '');
    let synopsis: string | null = truncateText(
        parseTextFromMarkDown(novel.synopsis_ua || novel.synopsis_en || ''),
        150,
        true,
    );

    return _generateMetadata({
        title: {
            default: title,
            template: `%s / ${title} / Hikka`,
        },
        description: synopsis,
        images: `https://preview.hikka.io/novel/${slug}/${novel.updated}`,
        other: {
            'mal-id': novel.mal_id,
        },
    });
}
