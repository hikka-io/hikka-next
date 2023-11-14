'use client';

import MiFeatureSearch from '@/app/_components/icons/MiFeatureSearch';
import {PropsWithChildren, ReactNode} from 'react';

interface Props extends PropsWithChildren {
    title: string | ReactNode;
    description?: string | ReactNode;
}

const Component = ({ title, description, children }: Props) => {
    return (
        <div className="flex justify-between items-center md:flex-row flex-col gap-4 rounded-lg border border-secondary p-6">
            <div className="flex gap-4 items-center">
                <MiFeatureSearch className="text-4xl opacity-60" />
                <div className="flex flex-col gap-1">
                    <h3 className="opacity-60">{title}</h3>
                    {description && <p className="opacity-30">{description}</p>}
                </div>
            </div>
            {children}
        </div>
    );
};

export default Component;
