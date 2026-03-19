import { ComponentType, FC, createElement } from 'react';

import { cn } from '@/utils/cn';

interface Props {
    status: string;
    icon: ComponentType;
}

const ContentStatus: FC<Props> = ({ status, icon }) => (
    <div className="absolute top-0 left-0 isolate w-full">
        <div
            className={cn(
                'absolute top-2 right-2 z-1 w-fit rounded-md border p-1',
                `bg-${status} text-${status}-foreground border-${status}-border`,
            )}
        >
            {createElement(icon)}
        </div>
        <div className="absolute top-0 left-0 z-0 h-16 w-full bg-linear-to-b from-black/60 to-transparent" />
    </div>
);

export default ContentStatus;
