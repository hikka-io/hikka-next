import { type FC, Fragment, type ReactNode } from 'react';

import { WatchStatusEnum } from '@hikka/api';

import ContentStatus from '@/components/content-card/content-status';
import { Kbd } from '@/components/ui/kbd';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';

import GraphOrderTile from './graph-order-tile';
import { NODE_RING_CLASS, NODE_RING_COLOR } from './node-rings';

const KEYS: { label: string; keys: string[] }[] = [
    { label: 'Вибрати', keys: ['Enter'] },
    { label: 'Відкрити сторінку', keys: ['O'] },
    { label: 'Масштаб', keys: ['+', '−'] },
    { label: 'Уся франшиза', keys: ['Shift', '1'] },
    { label: 'До обраного', keys: ['Shift', '2'] },
    { label: 'До цього тайтлу', keys: ['C'] },
    { label: 'Пошук', keys: ['Ctrl', 'F'] },
    { label: 'Закрити', keys: ['Esc'] },
];

const MarkerPoster: FC<{ ring: keyof typeof NODE_RING_COLOR }> = ({ ring }) => (
    <span
        className={cn(
            'h-7 w-5 shrink-0 rounded-sm bg-muted',
            NODE_RING_CLASS.ringed,
            NODE_RING_COLOR[ring],
        )}
    />
);

const MARKERS: { label: string; marker: ReactNode }[] = [
    { label: 'Цей тайтл', marker: <MarkerPoster ring="current" /> },
    { label: 'Обраний', marker: <MarkerPoster ring="selected" /> },
    {
        label: 'Порядок перегляду',
        marker: <GraphOrderTile order={2} isCurrent={false} />,
    },
    {
        label: 'Статус у вашому списку',
        marker: (
            <span className="flex gap-1">
                {[WatchStatusEnum.COMPLETED, WatchStatusEnum.WATCHING].map(
                    (value) => (
                        <ContentStatus
                            key={value}
                            status={{ value, kind: 'watch' }}
                            size="sm"
                            inline
                        />
                    ),
                )}
            </span>
        ),
    },
];

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const GraphHelp: FC<Props> = ({ open, onOpenChange }) => (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
        <ResponsiveModalContent
            title="Клавіші й позначки"
            className="md:max-w-170"
        >
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
                <dl className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2.5 text-sm">
                    {KEYS.map(({ label, keys }) => (
                        <Fragment key={label}>
                            <dt>{label}</dt>
                            <dd className="flex gap-1">
                                {keys.map((key) => (
                                    <Kbd key={key}>{key}</Kbd>
                                ))}
                            </dd>
                        </Fragment>
                    ))}
                </dl>
                <Separator orientation="vertical" className="max-md:hidden" />
                <ul className="flex flex-col gap-3 text-sm">
                    {MARKERS.map(({ label, marker }) => (
                        <li key={label} className="flex items-center gap-3">
                            {marker}
                            {label}
                        </li>
                    ))}
                </ul>
            </div>
        </ResponsiveModalContent>
    </ResponsiveModal>
);

export default GraphHelp;
