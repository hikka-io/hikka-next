import { type FC, type ReactNode, useCallback } from 'react';

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

type Props = {
    title: string;
    value?: string | number | string[] | null;
    children?: ReactNode;
    icon?: ReactNode;
    className?: string;
};

const DetailItem: FC<Props> = ({ title, value, children, icon, className }) => {
    const renderValue = useCallback(() => {
        if (children) {
            return children;
        }

        if (Array.isArray(value)) {
            const formattedValue = value.join(', ');

            if (value.length < 2) {
                return (
                    <p className="line-clamp-2 cursor-text select-auto font-medium text-sm leading-tight">
                        {formattedValue}
                    </p>
                );
            }

            return (
                <HoverCard openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                        <span className="line-clamp-2 cursor-text font-medium text-sm leading-tight">
                            {formattedValue}
                        </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="flex w-auto max-w-[300px] flex-col gap-2 p-3 text-left text-sm">
                        {value.map((item, index) => (
                            <p key={item}>
                                <span className="text-muted-foreground">
                                    {index + 1}.{' '}
                                </span>
                                {item}
                            </p>
                        ))}
                    </HoverCardContent>
                </HoverCard>
            );
        }

        return (
            <p className="line-clamp-2 cursor-text select-auto font-medium text-sm leading-tight">
                {value}
            </p>
        );
    }, [value, children]);

    if ((!value && !children) || (Array.isArray(value) && value.length === 0)) {
        return null;
    }

    return (
        <div
            className={cn(
                'grid grid-cols-2 items-start justify-between gap-2',
                className,
            )}
        >
            <div className="flex items-center gap-3 text-muted-foreground">
                {icon}
                <Label className="line-clamp-2 flex-1">{title}</Label>
            </div>

            <div className="flex flex-1 items-center justify-end text-right">
                {renderValue()}
            </div>
        </div>
    );
};

export default DetailItem;
