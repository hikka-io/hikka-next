import type { FC } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';

type Props = {
    content_type: MainContentTypeEnum;
};

const ProgressSkeleton: FC<{ className?: string }> = ({ className }) => (
    <TableCell className={cn('w-20', className)}>
        <Skeleton className="mx-auto h-4 w-12" />
    </TableCell>
);

const TableRowSkeleton: FC<Props> = ({ content_type }) => {
    const isAnime = content_type === ContentTypeEnum.ANIME;

    return (
        <TableRow className="hover:bg-transparent">
            <TableCell className="w-12 pr-0">
                <Skeleton className="h-4 w-4" />
            </TableCell>
            <TableCell className="w-36">
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className="hidden w-12 lg:block">
                        <AspectRatio ratio={DEFAULT_CONTAINER_RATIO}>
                            <Skeleton className="size-full rounded-(--base-radius)" />
                        </AspectRatio>
                    </div>
                    <div className="flex flex-1 flex-col">
                        <Skeleton className="my-0.5 h-4 w-40 max-w-full" />
                    </div>
                </div>
            </TableCell>
            <TableCell className="w-4">
                <Skeleton className="mx-auto h-5.5 w-12 rounded-sm" />
            </TableCell>
            {isAnime ? (
                <>
                    <ProgressSkeleton className="max-md:pr-4!" />
                    <TableCell className="hidden w-20 lg:table-cell">
                        <Skeleton className="mx-auto h-4 w-10" />
                    </TableCell>
                </>
            ) : (
                <>
                    <ProgressSkeleton />
                    <ProgressSkeleton className="max-md:pr-4!" />
                </>
            )}
        </TableRow>
    );
};

export default TableRowSkeleton;
