'use client';

import * as React from 'react';
import { FC } from 'react';
import MaterialSymbolsArrowDropDownRounded from '~icons/material-symbols/arrow-drop-down-rounded';

import Planned from '@/components/icons/watch-status/planned';
import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';

import useAddWatch from '@/services/hooks/watch/use-add-watch';
import { cn } from '@/utils/utils';

interface NewStatusTriggerProps {
    disabled?: boolean;
    slug: string;
}

const NewStatusTrigger: FC<NewStatusTriggerProps> = ({ disabled, slug }) => {
    const { mutate: addWatch } = useAddWatch();

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addWatch({
            params: {
                slug,
                status: 'planned',
            },
        });
    };

    return (
        <SelectTrigger
            asChild
            className="gap-0 border-none p-0"
            onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="flex w-full">
                <Button
                    variant="secondary"
                    disabled={disabled}
                    onClick={handleAddToPlanned}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    <Planned />
                    <span className="truncate rounded-none">
                        Додати у список
                    </span>
                </Button>
                <Button
                    variant="secondary"
                    size="icon"
                    type="button"
                    disabled={disabled}
                    className={cn('rounded-l-none text-xl')}
                >
                    <MaterialSymbolsArrowDropDownRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default NewStatusTrigger;
