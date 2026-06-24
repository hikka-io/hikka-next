'use client';

import type { PropsWithChildren, ReactNode } from 'react';

import MaterialSymbolsFeatureSearch from '../icons/material-symbols/MaterialSymbolsFeatureSearch';

type Props = PropsWithChildren & {
    title: string | ReactNode;
    description?: string | ReactNode;
};

const Component = ({ title, description, children }: Props) => {
    return (
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-border bg-secondary/20 p-6 lg:flex-row">
            <div className="flex flex-1 items-center gap-4">
                <MaterialSymbolsFeatureSearch className="size-10 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl">{title}</h3>
                    {description && (
                        <p className="text-muted-foreground text-sm">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
};

export default Component;
