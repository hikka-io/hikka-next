import { ComponentType, FC, createElement } from 'react';

import { cn } from '@/utils/cn';

interface Props {
    status: string;
    icon: ComponentType;
    size?: 'default' | 'sm';
}

const ContentStatus: FC<Props> = ({ status, icon, size = 'default' }) => (
    <div className="absolute top-0 left-0 isolate w-full">
        <div
            className={cn(
                'absolute z-1 w-fit rounded-md border',
                size === 'sm'
                    ? 'top-1 right-1 rounded-sm p-1 [&>svg]:size-3'
                    : 'top-2 right-2 p-1',
                `bg-${status} text-${status}-foreground border-${status}-border`,
            )}
        >
            {createElement(icon)}
        </div>
        <div
            className={cn(
                'absolute top-0 left-0 z-0 w-full bg-linear-to-b from-black/60 to-transparent',
                size === 'sm' ? 'h-8' : 'h-16',
            )}
        />
    </div>
);

export default ContentStatus;
