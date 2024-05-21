import { Metadata } from 'next';

import getAnimeInfo, {
    Response as AnimeResponse,
} from '@/services/api/anime/getAnimeInfo';
import _generateMetadata from '@/utils/generateMetadata';
import parseTextFromMarkDown from '@/utils/parseTextFromMarkDown';
import truncateText from '@/utils/truncateText';

export interface MetadataProps {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const slug = params.slug;

    const anime: AnimeResponse = await getAnimeInfo({ params: { slug } });

    const startDate = anime.start_date
        ? new Date(anime.start_date * 1000).getFullYear()
        : null;
    const title =
        (anime.title_ua || anime.title_en || anime.title_ja) +
        (startDate ? ` (${startDate})` : '');
    let synopsis: string | null = truncateText(
        parseTextFromMarkDown(anime.synopsis_ua || anime.synopsis_en),
        150,
        true,
    );

    return _generateMetadata({
        title: {
            default: title,
            template: title + ' / %s / Hikka',
        },
        description: synopsis,
        images: `https://preview.hikka.io/anime/${slug}/${anime.updated}`,
    });
}
