import Link from 'next/link';

import EntryCard from '@/components/entry-card/entry-card';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';

interface Props {
    anime: API.Anime;
    rewatches: number;
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
    note?: string;
}

const Component = ({ anime, rewatches, note, titleLanguage }: Props) => {
    return (
        <TableCell className="w-36">
            <div className="flex items-center gap-4">
                <div className="hidden w-12 lg:block">
                    <EntryCard
                        poster={anime.poster}
                        href={`/anime/${anime.slug}`}
                    />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Link
                            className="line-clamp-2 hover:underline"
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
                    {note && (
                        <MDViewer className="text-xs text-muted-foreground">
                            {note}
                        </MDViewer>
                    )}
                </div>
            </div>
        </TableCell>
    );
};

export default Component;
