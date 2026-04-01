'use client';

import { PropsWithChildren, ReactNode } from 'react';

import MaterialSymbolsFeatureSearch from '../icons/material-symbols/MaterialSymbolsFeatureSearch';

interface Props extends PropsWithChildren {
    title: string | ReactNode;
    description?: string | ReactNode;
}

const Component = ({ title, description, children }: Props) => {
    return (
        <div className="border-border bg-secondary/20 flex flex-col items-center justify-between gap-4 rounded-lg border p-6 lg:flex-row">
            <div className="flex flex-1 items-center gap-4">
                <MaterialSymbolsFeatureSearch className="text-muted-foreground size-10 shrink-0" />
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
