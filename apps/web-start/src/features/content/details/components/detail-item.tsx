import { FC, ReactNode, useCallback } from 'react';

import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/utils/cn';

interface Props {
    title: string;
    value?: string | number | string[] | null;
    children?: ReactNode;
    icon?: ReactNode;
    className?: string;
}

const DetailItem: FC<Props> = ({ title, value, children, icon, className }) => {
    if ((!value && !children) || (Array.isArray(value) && value.length === 0)) {
        return null;
    }

    const renderValue = useCallback(() => {
        if (children) {
            return children;
        }

        if (Array.isArray(value)) {
            const formattedValue = value.join(', ');

            if (value.length < 2) {
                return (
                    <p className="line-clamp-2 cursor-text text-sm leading-tight font-medium select-auto">
                        {formattedValue}
                    </p>
                );
            }

            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="line-clamp-2 cursor-text text-sm leading-tight font-medium">
                            {formattedValue}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="flex max-w-[300px] flex-col gap-2 p-3 text-left">
                        {value.map((item, index) => (
                            <p key={item}>
                                <span className="text-muted-foreground">
                                    {index + 1}.{' '}
                                </span>
                                {item}
                            </p>
                        ))}
                    </TooltipContent>
                </Tooltip>
            );
        }

        return (
            <p className="line-clamp-2 cursor-text text-sm leading-tight font-medium select-auto">
                {value}
            </p>
        );
    }, [value, children]);

    return (
        <div
            className={cn(
                'grid grid-cols-2 items-start justify-between gap-2',
                className,
            )}
        >
            <div className="text-muted-foreground flex items-center gap-3">
                {icon}
                <Label className="line-clamp-2 flex-1">{title}</Label>
            </div>

            <div className="flex-1 text-right">{renderValue()}</div>
        </div>
    );
};

export default DetailItem;
