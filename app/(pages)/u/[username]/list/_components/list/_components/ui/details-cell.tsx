import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import BaseCard from '@/components/ui/base-card';
import { TableCell } from '@/components/ui/table';

interface Props {
    anime: API.Anime;
    rewatches: number;
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
}

const Component = ({ anime, rewatches, titleLanguage }: Props) => (
    <TableCell>
        <div className="flex gap-4">
            <div className="hidden w-12 lg:block">
                <BaseCard poster={anime.poster} href={`/anime/${anime.slug}`} />
            </div>
            <div className="flex-1">
                <div className="flex gap-2 items-center">
                    <Link
                        className="hover:underline"
                        href={`/anime/${anime.slug}`}
                    >
                        {anime[titleLanguage] ||
                            anime.title_ua ||
                            anime.title_en ||
                            anime.title_ja}
                    </Link>
                    {rewatches > 0 && (
                        <Badge variant="outline">{rewatches}</Badge>
                    )}
                </div>
            </div>
        </div>
    </TableCell>
);

export default Component;
