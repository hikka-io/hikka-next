import { ComponentType, FC, createElement } from 'react';

import { cn } from '@/utils/cn';

interface Props {
    status: string;
    icon: ComponentType;
}

const ContentStatus: FC<Props> = ({ status, icon }) => (
    <div className="absolute left-0 top-0 isolate w-full">
        <div
            className={cn(
                'absolute right-2 top-2 z-[1] w-fit rounded-md border p-1',
                `bg-${status} text-${status}-foreground border-${status}-border`,
            )}
        >
            {createElement(icon)}
        </div>
        <div className="absolute left-0 top-0 z-0 h-16 w-full bg-gradient-to-b from-black/60 to-transparent" />
    </div>
);

export default ContentStatus;
