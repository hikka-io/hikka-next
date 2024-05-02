import { ChevronsUpDown } from 'lucide-react';
import React, { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Props {
    children: ReactNode;
}

const Spoiler = ({ children }: Props) => {
    return (
        <Collapsible className="mb-4 w-full  space-y-2">
            <CollapsibleTrigger asChild>
                <Button variant="secondary" size="badge">
                    Спойлер <ChevronsUpDown className="size-3" />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="rounded-md border border-secondary/60 bg-secondary/30 p-2">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default Spoiler;
