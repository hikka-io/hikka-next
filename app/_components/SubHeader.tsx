'use client';

import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    title: string;
    href?: string;
}

const Component = ({ title, href, children }: Props) => {
    return (
        <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-8 items-center">
                <h3>{title}</h3>
                {children}
            </div>
            {href && (
                <Link
                    href={href}
                    className="btn btn-badge btn-ghost btn-square"
                >
                    <MaterialSymbolsArrowRightAltRounded className="text-2xl" />
                </Link>
            )}
        </div>
    );
};

export default Component;
