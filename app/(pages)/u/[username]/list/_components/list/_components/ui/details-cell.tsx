import { useState } from 'react';



import Link from 'next/link';



import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Badge } from '@/components/ui/badge';
import BaseCard from '@/components/ui/base-card';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';


interface Props {
    anime: API.Anime;
    rewatches: number;
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
    note?: string;
}

const Component = ({ anime, rewatches, note, titleLanguage }: Props) => {
    const [expandNote, setExpandNote] = useState(false);
    
    return (
        <TableCell>
            <div className="flex gap-4 items-center">
                <div className="hidden w-12 lg:block">
                    <BaseCard poster={anime.poster} href={`/anime/${anime.slug}`} />
                </div>
                <div className="flex-1 flex flex-col gap-2">
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
                    {note && <MDViewer className="text-muted-foreground text-xs">{note}</MDViewer>}
                </div>
            </div>
        </TableCell>
    );
}

export default Component;
