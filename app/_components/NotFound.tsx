'use client';

import MaterialSymbolsFeatureSearch from '~icons/material-symbols/feature-search';
import { PropsWithChildren, ReactNode } from 'react';

interface Props extends PropsWithChildren {
    title: string | ReactNode;
    description?: string | ReactNode;
}

const Component = ({ title, description, children }: Props) => {
    return (
        <div className="flex justify-between items-center lg:flex-row flex-col bg-secondary/30 gap-4 rounded-lg border border-secondary p-6">
            <div className="flex gap-4 items-center">
                <MaterialSymbolsFeatureSearch className="text-4xl label-text" />
                <div className="flex flex-col gap-1">
                    <h3 className="label-text text-xl">{title}</h3>
                    {description && <p className="label-text opacity-60">{description}</p>}
                </div>
            </div>
            {children}
        </div>
    );
};

export default Component;
