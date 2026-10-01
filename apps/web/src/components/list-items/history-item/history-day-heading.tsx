import type { FC } from 'react';

type Props = {
    label: string;
    detail: string;
    large: boolean;
};

const HistoryDayHeading: FC<Props> = ({ label, detail, large }) =>
    large ? (
        <div className="mb-4 flex items-baseline gap-2">
            <h4>{label}</h4>
            <span className="text-muted-foreground text-sm">{detail}</span>
        </div>
    ) : (
        <div className="mb-3 flex items-baseline gap-1.5 text-xs">
            <span className="font-medium text-muted-foreground">{label}</span>
            <span className="text-muted-foreground opacity-60">{detail}</span>
        </div>
    );

export default HistoryDayHeading;
