import React, { PropsWithChildren } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';

const Component = ({ children }: PropsWithChildren) => {
    return (
        <Collapsible className="w-full space-y-2  mb-4">
            <CollapsibleTrigger asChild>
                <Button variant="secondary" size="badge">
                    Спойлер <ChevronsUpDown className="h-3 w-3" />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="border border-secondary/60 bg-secondary/30 p-2 rounded-md">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default Component;