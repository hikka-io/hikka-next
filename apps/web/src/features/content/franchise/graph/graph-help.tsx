import { type FC, Fragment } from 'react';

import { Kbd } from '@/components/ui/kbd';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

const KEYS: { label: string; keys: string[] }[] = [
    { label: 'Масштаб', keys: ['+', '−'] },
    { label: 'Уся франшиза', keys: ['Shift', '1'] },
    { label: 'До обраного', keys: ['Shift', '2'] },
    { label: 'До цього тайтлу', keys: ['C'] },
    { label: 'Пошук', keys: ['Ctrl', 'F'] },
    { label: 'На весь екран', keys: ['F'] },
    { label: 'Закрити', keys: ['Esc'] },
];

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const GraphHelp: FC<Props> = ({ open, onOpenChange }) => (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
        <ResponsiveModalContent title="Клавіші">
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
        </ResponsiveModalContent>
    </ResponsiveModal>
);

export default GraphHelp;
