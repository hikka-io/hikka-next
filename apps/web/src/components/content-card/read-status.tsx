import { ReadResponseBase, ReadStatusEnum } from '@hikka/client';
import { FC, createElement } from 'react';

import { cn } from '@/utils/cn';
import { READ_STATUS } from '@/utils/constants/common';

interface Props {
    read: ReadResponseBase;
}

const ReadStatus: FC<Props> = ({ read }) => (
    <div className="absolute left-0 top-0 w-full">
        <div
            className={cn(
                'absolute right-2 top-2 z-[1] w-fit rounded-md border p-1',
                `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
            )}
        >
            {createElement(READ_STATUS[read.status as ReadStatusEnum].icon!)}
        </div>
        <div className="absolute left-0 top-0 z-0 h-16 w-full bg-gradient-to-b from-black/60 to-transparent" />
    </div>
);

export default ReadStatus;
