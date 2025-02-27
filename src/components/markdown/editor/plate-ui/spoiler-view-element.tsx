'use client';

import { cn, withRef } from '@udecode/cn';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { PlateElement } from './plate-element';

export const SpoilerViewElement = withRef<typeof PlateElement>(
    ({ children, className, ...props }, ref) => {
        return (
            <Collapsible
                ref={ref}
                className={cn('mb-4 w-full space-y-2', className)}
            >
                <CollapsibleTrigger asChild>
                    <Button variant="secondary" size="badge">
                        Спойлер <ChevronsUpDown className="size-3" />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="rounded-md border border-border bg-secondary/20 p-2">
                    {children}
                </CollapsibleContent>
            </Collapsible>
        );
    },
);
