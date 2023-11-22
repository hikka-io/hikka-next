'use client';

import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    title: string;
    href?: string;
    variant?: "h4" | "h5";
}

const Component = ({ title, href, variant, children }: Props) => {
    const Title = variant ? variant : 'h3';

    return (
        <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-8 items-center">
                <Title>{title}</Title>
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
