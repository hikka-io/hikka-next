import { ChevronsUpDown } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils/utils';
import { Button } from '../ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../ui/collapsible';

interface Props {
    children: ReactNode;
    className?: string;
}

const Spoiler: FC<Props> = ({ children, className }) => {
    return (
        <Collapsible className={cn('spoiler w-full space-y-2', className)}>
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
