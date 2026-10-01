import type { FC } from 'react';

import type { HistorySize } from './history-row';

type Props = {
    label: string;
    detail: string;
    size: HistorySize;
};

const HistoryDayHeading: FC<Props> = ({ label, detail, size }) =>
    size === 'lg' ? (
        <div className="mb-4 flex items-baseline gap-2">
            <h4>{label}</h4>
            <span className="text-muted-foreground text-sm">{detail}</span>
        </div>
    ) : (
        <div className="mb-3 flex items-baseline gap-1.5 text-muted-foreground text-xs">
            <span className="font-medium">{label}</span>
            <span className="opacity-60">{detail}</span>
        </div>
    );

export default HistoryDayHeading;
