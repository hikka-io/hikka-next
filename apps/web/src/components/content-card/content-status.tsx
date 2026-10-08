import { type ComponentType, createElement, type FC } from 'react';

import { LIST_STATUS_ICONS } from '@/components/icons/list-status-icons';
import { cn } from '@/utils/cn';

export type CardStatus = {
    value: string;
    kind: 'watch' | 'read';
};

type Props = {
    status: CardStatus;
    size?: 'default' | 'sm';
};

/**
 * The API types a tracking status as a bare `string`, so a value this build has
 * no icon for renders nothing instead of throwing on the missing entry.
 */
const ContentStatus: FC<Props> = ({ status, size = 'default' }) => {
    const Icon: ComponentType | undefined =
        LIST_STATUS_ICONS[status.kind][
            status.value as keyof (typeof LIST_STATUS_ICONS)[typeof status.kind]
        ];

    if (!Icon) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 isolate w-full">
            <div
                className={cn(
                    'absolute z-1 w-fit rounded-md border',
                    size === 'sm'
                        ? 'top-1 right-1 rounded-sm p-1 [&>svg]:size-3'
                        : 'top-2 right-2 p-1',
                    `bg-${status.value} text-${status.value}-foreground border-${status.value}-border`,
                )}
            >
                {createElement(Icon)}
            </div>
            <div
                className={cn(
                    'absolute top-0 left-0 z-0 w-full bg-linear-to-b from-black/60 to-transparent',
                    size === 'sm' ? 'h-8' : 'h-16',
                )}
            />
        </div>
    );
};

export default ContentStatus;
