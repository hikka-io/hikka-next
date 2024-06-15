import Link from 'next/link';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';
import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';

interface Props {
    content: API.Manga;
    content_type: 'manga' | 'novel';
    rereads: number;
    note?: string;
}

const DetailsCell: FC<Props> = ({ content, content_type, rereads, note }) => {
    return (
        <TableCell className="w-36">
            <div className="flex items-center gap-4">
                <div className="hidden w-12 lg:block">
                    <ContentCard
                        poster={content.image}
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
                        {rereads > 0 && (
                            <Badge variant="outline">{rereads}</Badge>
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
