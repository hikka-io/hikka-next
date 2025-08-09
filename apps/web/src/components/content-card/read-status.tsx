import { ReadResponseBase, ReadStatusEnum } from '@hikka/client';
import { FC, createElement } from 'react';

import { READ_STATUS } from '@/utils/constants/common';

interface Props {
    read: ReadResponseBase;
}

const ReadStatus: FC<Props> = ({ read }) => (
    <div className="absolute left-0 top-0 w-full">
        <div
            className="absolute right-2 top-2 z-[1] w-fit rounded-md border-white p-1 text-white"
            style={{
                backgroundColor: `hsl(${READ_STATUS[read.status as ReadStatusEnum].color})`,
            }}
        >
            {createElement(READ_STATUS[read.status as ReadStatusEnum].icon!)}
        </div>
        <div className="from-background absolute left-0 top-0 z-0 h-16 w-full bg-gradient-to-b to-transparent" />
    </div>
);

export default ReadStatus;
