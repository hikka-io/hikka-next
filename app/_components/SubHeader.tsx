'use client';

import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import clsx from "clsx";

interface Props extends PropsWithChildren {
    title: string;
    href?: string;
    variant?: "h4" | "h5";
    className?: string;
    titleClassName?: string;
}

const Component = ({ title, href, variant, children, className, titleClassName }: Props) => {
    const Title = variant ? variant : 'h3';

    return (
        <div className={clsx("flex gap-2 justify-between items-center", className)}>
            <div className={clsx("flex gap-8 items-center", titleClassName)}>
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
