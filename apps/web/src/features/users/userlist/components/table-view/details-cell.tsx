import {
    AnimeResponse,
    ContentTypeEnum,
    MangaResponse,
    NovelResponse,
} from '@hikka/client';
import Link from 'next/link';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';
import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';

interface Props {
    content: MangaResponse | NovelResponse | AnimeResponse;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
    repeats: number;
    note?: string;
}

const DetailsCell: FC<Props> = ({ content, content_type, repeats, note }) => {
    return (
        <TableCell className="w-36">
            <div className="flex items-center gap-4">
                <div className="hidden w-12 lg:block">
                    <ContentCard
                        image={content.image}
                        href={`/${content_type}/${content.slug}`}
                    />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Link
                            className="line-clamp-2 hover:underline"
                            href={`/${content_type}/${content.slug}`}
                        >
                            {content.title}
                        </Link>
                        {repeats > 0 && (
                            <Badge variant="outline">{repeats}</Badge>
                        )}
                    </div>
                    {note && (
                        <TextExpand>
                            <MDViewer className="text-xs text-muted-foreground">
                                {note}
                            </MDViewer>
                        </TextExpand>
                    )}
                </div>
            </div>
        </TableCell>
    );
};

export default DetailsCell;
