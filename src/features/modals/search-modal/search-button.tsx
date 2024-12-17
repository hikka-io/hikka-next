'use client';

import * as React from 'react';
import { ReactNode, cloneElement } from 'react';
import MaterialSymbolsSearch from '~icons/material-symbols/search';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils/utils';

interface Props {
    setOpen: (open: boolean) => void;
    children?: ReactNode;
}

const Component = ({ setOpen, children }: Props) => {
    return children ? (
        cloneElement(children as React.ReactElement, {
            //@ts-ignore
            onClick: () => setOpen(true),
        })
    ) : (
        <Button
            size="md"
            variant="outline"
            onClick={() => setOpen(true)}
            className={cn(
                'bg-secondary/30 hover:!bg-secondary/60',
                'lg:w-48 lg:justify-between lg:font-normal lg:!text-foreground/60',
                'transition-all duration-200',
                'lg:hover:w-60',
                'items-center',
            )}
        >
            <div className="flex items-center gap-2">
                <MaterialSymbolsSearch />{' '}
                <span className="hidden lg:block">Пошук...</span>
            </div>
            <div className="hidden items-center lg:flex">
                <kbd className="pointer-events-none flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span className="text-xs">/</span>
                </kbd>
            </div>
        </Button>
    );
};

export default Component;
