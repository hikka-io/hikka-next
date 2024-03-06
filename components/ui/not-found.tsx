'use client';

import { PropsWithChildren, ReactNode } from 'react';
import MaterialSymbolsFeatureSearch from '~icons/material-symbols/feature-search';
import H3 from '@/components/typography/h3';
import P from '@/components/typography/p';

interface Props extends PropsWithChildren {
    title: string | ReactNode;
    description?: string | ReactNode;
}

const Component = ({ title, description, children }: Props) => {
    return (
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-secondary/60 bg-secondary/30 p-6 lg:flex-row">
            <div className="flex items-center gap-4">
                <MaterialSymbolsFeatureSearch className="text-muted-foreground text-4xl" />
                <div className="flex flex-col gap-1 flex-1">
                    <H3 className="text-xl">{title}</H3>
                    {description && (
                        <P className="text-muted-foreground text-sm">{description}</P>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
};

export default Component;
