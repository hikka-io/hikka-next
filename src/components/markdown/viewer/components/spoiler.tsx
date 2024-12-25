import { ChevronsUpDown } from 'lucide-react';
import { ReactNode } from 'react';

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
            <CollapsibleContent className="rounded-md border border-border bg-secondary/20 p-2">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default Spoiler;
