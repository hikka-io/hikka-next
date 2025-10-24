'use client';

import { PropsWithChildren, ReactNode } from 'react';

import MaterialSymbolsFeatureSearch from '../icons/material-symbols/MaterialSymbolsFeatureSearch';
import H3 from '../typography/h3';
import P from '../typography/p';

interface Props extends PropsWithChildren {
    title: string | ReactNode;
    description?: string | ReactNode;
}

const Component = ({ title, description, children }: Props) => {
    return (
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-border bg-secondary/20 p-6 lg:flex-row">
            <div className="flex flex-1 items-center gap-4">
                <MaterialSymbolsFeatureSearch className="size-10 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                    <H3 className="text-xl">{title}</H3>
                    {description && (
                        <P className="text-sm text-muted-foreground">
                            {description}
                        </P>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
};

export default Component;
