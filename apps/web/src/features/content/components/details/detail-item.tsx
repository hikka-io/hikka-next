import { FC, ReactNode, useCallback } from 'react';

import P from '@/components/typography/p';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/utils/utils';

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
                    <P className="text-sm font-medium leading-tight cursor-text line-clamp-2 select-auto">
                        {formattedValue}
                    </P>
                );
            }

            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="text-sm font-medium leading-tight cursor-text line-clamp-2">
                            {formattedValue}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] text-left flex flex-col gap-2 p-3">
                        {value.map((item, index) => (
                            <P key={item}>
                                <span className="text-muted-foreground">
                                    {index + 1}.{' '}
                                </span>
                                {item}
                            </P>
                        ))}
                    </TooltipContent>
                </Tooltip>
            );
        }

        return (
            <P className="text-sm font-medium leading-tight cursor-text line-clamp-2 select-auto">
                {value}
            </P>
        );
    }, [value, children]);

    return (
        <div
            className={cn(
                'grid grid-cols-2 justify-between items-start gap-2',
                className,
            )}
        >
            <div className="flex items-center gap-3 text-muted-foreground">
                {icon}
                <Label className="flex-1 line-clamp-2">{title}</Label>
            </div>

            <div className="flex-1 text-right">{renderValue()}</div>
        </div>
    );
};

export default DetailItem;
