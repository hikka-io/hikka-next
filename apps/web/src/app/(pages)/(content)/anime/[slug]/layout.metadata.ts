import { AnimeInfoResponse } from '@hikka/client';
import { getHikkaClient } from '@hikka/react/core';
import { Metadata } from 'next';

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
    const client = getHikkaClient();

    const anime: AnimeInfoResponse = await client.anime.getAnimeBySlug(slug);

    const startDate = anime.start_date
        ? new Date(anime.start_date * 1000).getFullYear()
        : null;
    const title =
        (anime.title_ua || anime.title_en || anime.title_ja) +
        (startDate ? ` (${startDate})` : '');
    let synopsis: string | null = truncateText(
        parseTextFromMarkDown(anime.synopsis_ua || anime.synopsis_en || ''),
        150,
        true,
    );

    return _generateMetadata({
        title: {
            default: title,
            template: `%s / ${title} / Hikka`,
        },
        description: synopsis,
        images: `https://preview.hikka.io/anime/${slug}/${anime.updated}`,
        other: {
            'mal-id': anime.mal_id,
        },
        robots: {
            index: anime.rating !== 'rx',
        },
    });
}
