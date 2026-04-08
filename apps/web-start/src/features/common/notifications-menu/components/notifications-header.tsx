'use client';

import { FC } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';

interface Props {
    unseenCount: number;
    isBulkMarking: boolean;
    onMarkAllSeen: () => void;
    className?: string;
}

const NotificationsHeader: FC<Props> = ({
    unseenCount,
    isBulkMarking,
    onMarkAllSeen,
    className,
}) => {
    return (
        <div
            className={cn('flex items-center justify-between gap-2', className)}
        >
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Сповіщення</span>
                {unseenCount > 0 && (
                    <Badge variant="warning">{unseenCount}</Badge>
                )}
            </div>
            {unseenCount > 0 && (
                <Button
                    size="badge"
                    variant="outline"
                    disabled={isBulkMarking}
                    onClick={onMarkAllSeen}
                >
                    Прочитати всі
                </Button>
            )}
        </div>
    );
};

export default NotificationsHeader;
