import { type ComponentType, createElement, type FC } from 'react';

import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';

export type CardStatus = {
    value: string;
    kind: 'watch' | 'read';
};

type Props = {
    status: CardStatus;
    size?: 'default' | 'sm';
};

const STATUS_CONFIG = {
    watch: WATCH_STATUS,
    read: READ_STATUS,
} as const;

/**
 * The API types a tracking status as a bare `string`, so a value this build has
 * no icon for renders nothing instead of throwing on the missing entry.
 */
const ContentStatus: FC<Props> = ({ status, size = 'default' }) => {
    const config: { icon?: ComponentType } | undefined =
        STATUS_CONFIG[status.kind][
            status.value as keyof (typeof STATUS_CONFIG)[typeof status.kind]
        ];

    if (!config?.icon) {
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
                {createElement(config.icon)}
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
