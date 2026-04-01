import { ChevronsUpDown } from 'lucide-react';
import { SlateElement, SlateElementProps } from 'platejs/static';

import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { cn } from '@/utils/cn';

export function SpoilerElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            as={Collapsible as any}
            {...props}
            className={cn('spoiler w-full space-y-2')}
        >
            <CollapsibleTrigger asChild>
                <Button variant="secondary" size="badge">
                    Спойлер <ChevronsUpDown className="size-3" />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-border bg-secondary/20 rounded-md border p-2">
                {props.children}
            </CollapsibleContent>
        </SlateElement>
    );
}
