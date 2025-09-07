import { FC, ReactNode, useCallback } from 'react';

import P from '@/components/typography/p';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
    title: string;
    value?: string | number | string[] | null;
    children?: ReactNode;
    icon?: ReactNode;
}

const DetailItem: FC<Props> = ({ title, value, children, icon }) => {
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
                    <TooltipContent className="max-w-[300px] text-center">
                        {formattedValue}
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
        <div className="grid grid-cols-2 justify-between items-start gap-2">
            <div className="flex items-center gap-3 text-ellipsis overflow-hidden text-muted-foreground">
                {icon}
                <Label className="flex-1 line-clamp-2">{title}</Label>
            </div>

            <div className="flex-1 text-right">{renderValue()}</div>
        </div>
    );
};

export default DetailItem;
