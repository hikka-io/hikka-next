import Link from 'next/link';

import BaseCard from '@/components/ui/base-card';
import { TableCell } from '@/components/ui/table';

interface Props {
    anime: Hikka.Anime;
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
}

const Component = ({ anime, titleLanguage }: Props) => (
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
                </div>
            </div>
        </div>
    </TableCell>
);

export default Component;
