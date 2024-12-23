import { CollapsibleProps } from '@radix-ui/react-collapsible';
import { FC } from 'react';

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

interface Props extends CollapsibleProps {}

const CollapsibleFilter: FC<Props> = ({
    title,
    children,
    className,
    ...props
}) => {
    return (
        <Collapsible
            className={cn(
                'group space-y-4 border border-secondary/60 bg-secondary/30 px-4 py-2 data-[state=open]:mb-4 data-[state=open]:rounded-lg data-[state=open]:py-4',
                '[&+div]:data-[state=open]:rounded-t-lg data-[state=open]:[&+div]:data-[state=closed]:rounded-b-lg',
                'data-[state=closed]:border-b-0 data-[state=closed]:has-[+div[data-state=open]]:mb-4 data-[state=closed]:has-[+div[data-state=open]]:rounded-b-lg data-[state=closed]:has-[+div[data-state=open]]:border-b',
                'first:rounded-t-lg last:rounded-b-lg last:!border-b',
                className,
            )}
            {...props}
        >
            <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between gap-2">
                    <Label>{title}</Label>
                    <Button id="title-collapse" variant="ghost" size="icon-sm">
                        <MaterialSymbolsKeyboardArrowUpRounded className="size-4 group-data-[state=closed]:hidden" />
                        <MaterialSymbolsKeyboardArrowDownRounded className="size-4 group-data-[state=open]:hidden" />
                    </Button>
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="w-full">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default CollapsibleFilter;
