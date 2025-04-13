import { FC, createElement } from 'react';

import { READ_STATUS } from '@/utils/constants/common';

interface Props {
    read: API.Read;
}

const ReadStatus: FC<Props> = ({ read }) => (
    <div className="absolute left-0 top-0 w-full">
        <div
            className="absolute right-2 top-2 z-[1] w-fit rounded-md border-white p-1 text-white"
            style={{
                backgroundColor:
                    READ_STATUS[read.status as API.ReadStatus].color,
            }}
        >
            {createElement(READ_STATUS[read.status as API.ReadStatus].icon!)}
        </div>
        <div className="absolute left-0 top-0 z-0 h-16 w-full bg-gradient-to-b from-background to-transparent" />
    </div>
);

export default ReadStatus;
