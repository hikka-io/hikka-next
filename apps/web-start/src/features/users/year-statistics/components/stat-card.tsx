import { FC, ReactNode } from 'react';

import Card from '@/components/ui/card';

import { cn } from '@/utils/cn';

interface StatCardProps {
    icon: React.ReactNode;
    value: number | string | ReactNode;
    label: string | ReactNode;
    className?: string;
}

const StatCard: FC<StatCardProps> = ({ icon, value, label, className }) => (
    <Card
        className={cn(
            'items-center flex-row bg-secondary/20 backdrop-blur',
            className,
        )}
    >
        <div className="shrink-0 size-6 rounded-sm bg-secondary/60 p-1 flex items-center justify-center">
            {icon}
        </div>
        <div className="flex flex-col flex-1 gap-1">
            {typeof value === 'string' || typeof value === 'number' ? (
                <span className="text-2xl font-bold">{value}</span>
            ) : (
                value
            )}
            {typeof label === 'string' ? (
                <span className="text-xs text-muted-foreground">{label}</span>
            ) : (
                label
            )}
        </div>
    </Card>
);

export default StatCard;
