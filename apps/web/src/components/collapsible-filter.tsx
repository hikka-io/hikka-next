import { CollapsibleProps } from '@radix-ui/react-collapsible';
import { FC, ReactNode } from 'react';

import MaterialSymbolsKeyboardArrowDownRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import MaterialSymbolsKeyboardArrowUpRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowUpRounded';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/utils';

export interface CollapsibleFilterProps extends CollapsibleProps {
    active?: boolean;
    icon?: ReactNode;
}

export const CollapsibleFilter: FC<CollapsibleFilterProps> = ({
    title,
    children,
    className,
    active,
    icon,
    ...props
}) => {
    return (
        <Collapsible
            defaultOpen={active}
            className={cn(
                'group border border-border bg-secondary/20 px-4 py-2 duration-200 data-[state=open]:mb-4 data-[state=open]:rounded-lg data-[state=open]:py-4',
                '[&+div]:data-[state=open]:rounded-t-lg data-[state=open]:[&+div]:data-[state=closed]:rounded-b-lg',
                'data-[state=closed]:border-b-0 data-[state=closed]:has-[+div[data-state=open]]:mb-4 data-[state=closed]:has-[+div[data-state=open]]:rounded-b-lg data-[state=closed]:has-[+div[data-state=open]]:border-b',
                'first:rounded-t-lg last:rounded-b-lg last:!border-b',
                className,
            )}
            {...props}
        >
            <CollapsibleTrigger asChild>
                <div className="flex cursor-pointer items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {icon && icon}
                        <Label className="cursor-pointer select-none">
                            {title}
                        </Label>
                        {active && (
                            <div className="size-2 rounded-full bg-success-foreground" />
                        )}
                    </div>
                    <Button id="title-collapse" variant="ghost" size="icon-sm">
                        <MaterialSymbolsKeyboardArrowUpRounded className="size-4 group-data-[state=closed]:hidden" />
                        <MaterialSymbolsKeyboardArrowDownRounded className="size-4 group-data-[state=open]:hidden" />
                    </Button>
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="w-full overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="mt-4 space-y-4">{children}</div>
            </CollapsibleContent>
        </Collapsible>
    );
};
