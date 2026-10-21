import type { FC } from 'react';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CollapsibleTrigger } from '@/components/ui/collapsible';

type Props = {
    count: number;
};

const ShowMoreTrigger: FC<Props> = ({ count }) => (
    <CollapsibleTrigger
        render={
            <Button
                variant="ghost"
                size="md"
                className="group w-full text-muted-foreground"
            />
        }
    >
        <ChevronDown className="group-data-panel-open:rotate-180" />
        <span className="group-data-panel-open:hidden">
            Показати ще {count}
        </span>
        <span className="hidden group-data-panel-open:inline">Згорнути</span>
    </CollapsibleTrigger>
);

export default ShowMoreTrigger;
