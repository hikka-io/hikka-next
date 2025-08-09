import { WatchResponseBase } from '@hikka/client';
import { FC, createElement } from 'react';

import { WATCH_STATUS } from '@/utils/constants/common';

interface Props {
    watch: WatchResponseBase;
}

const WatchStatus: FC<Props> = ({ watch }) => (
    <div className="absolute left-0 top-0 w-full isolate">
        <div
            className="absolute right-2 top-2 z-[1] w-fit rounded-md border-white p-1 text-white"
            style={{
                backgroundColor: `hsl(${WATCH_STATUS[watch.status].color})`,
            }}
        >
            {createElement(WATCH_STATUS[watch.status].icon!)}
        </div>
        <div className="from-background absolute left-0 top-0 z-0 h-16 w-full bg-gradient-to-b to-transparent" />
    </div>
);

export default WatchStatus;
