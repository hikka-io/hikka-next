import { WatchResponseBase } from '@hikka/client';
import { FC, createElement } from 'react';

import { cn } from '@/utils/cn';
import { WATCH_STATUS } from '@/utils/constants/common';

interface Props {
    watch: WatchResponseBase;
}

const WatchStatus: FC<Props> = ({ watch }) => (
    <div className="absolute left-0 top-0 isolate w-full">
        <div
            className={cn(
                'absolute right-2 top-2 z-[1] w-fit rounded-md border p-1 text-white',
                `bg-${watch.status} text-${watch.status}-foreground border-${watch.status}-border`,
            )}
        >
            {createElement(WATCH_STATUS[watch.status].icon!)}
        </div>
        <div className="absolute left-0 top-0 z-0 h-16 w-full bg-gradient-to-b from-black/60 to-transparent" />
    </div>
);

export default WatchStatus;
