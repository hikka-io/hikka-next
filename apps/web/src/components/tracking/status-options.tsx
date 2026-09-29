import { type ComponentType, createElement, type FC } from 'react';

import {
    READ_STATUS_ICONS,
    WATCH_STATUS_ICONS,
} from '@/components/icons/list-status-icons';
import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/labels/enum-labels';

type StatusIconChipProps = {
    status: string;
    icon: ComponentType<{ className?: string }>;
};

export const StatusIconChip: FC<StatusIconChipProps> = ({ status, icon }) => (
    <div
        className={cn(
            'w-fit rounded-sm border p-1',
            `bg-${status} text-${status}-foreground border-${status}-border`,
        )}
    >
        {createElement(icon, { className: 'size-3!' })}
    </div>
);

type StatusConfig = typeof WATCH_STATUS | typeof READ_STATUS;
type StatusIcons = typeof WATCH_STATUS_ICONS | typeof READ_STATUS_ICONS;

export const buildStatusOptions = (config: StatusConfig, icons: StatusIcons) =>
    Object.keys(config).map((status) => ({
        value: status,
        title: config[status as keyof StatusConfig].title_ua,
        label: (
            <div className="flex items-center gap-2">
                <StatusIconChip
                    status={status}
                    icon={icons[status as keyof StatusIcons]}
                />
                {config[status as keyof StatusConfig].title_ua}
            </div>
        ),
    }));

export type StatusOption = ReturnType<typeof buildStatusOptions>[number];

export const WATCH_STATUS_OPTIONS = buildStatusOptions(
    WATCH_STATUS,
    WATCH_STATUS_ICONS,
);

export const READ_STATUS_OPTIONS = buildStatusOptions(
    READ_STATUS,
    READ_STATUS_ICONS,
);
