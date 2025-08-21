import { WatchResponseBase } from '@hikka/client';
import { FC, createElement } from 'react';

import { WATCH_STATUS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

interface Props {
    watch: WatchResponseBase;
}

const WatchStatus: FC<Props> = ({ watch }) => (
    <div className="absolute left-0 top-0 w-full isolate">
        <div
            className={cn(
                'absolute right-2 top-2 z-[1] w-fit rounded-md border p-1 text-white',
                `bg-${watch.status} text-${watch.status}-foreground border-${watch.status}-border`,
            )}
        >
            {createElement(WATCH_STATUS[watch.status].icon!)}
        </div>
        <div className="from-black/60 absolute left-0 top-0 z-0 h-16 w-full bg-gradient-to-b to-transparent" />
    </div>
);

export default WatchStatus;
