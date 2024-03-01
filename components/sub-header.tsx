'use client';

import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface Props extends PropsWithChildren {
    title: string;
    href?: string;
    onClick?: () => void;
    variant?: 'h4' | 'h5';
    className?: string;
    titleClassName?: string;
}

const Component = ({
    title,
    href,
    onClick,
    variant,
    children,
    className,
    titleClassName,
}: Props) => {
    const Title = variant ? variant : 'h3';

    return (
        <div
            className={clsx(
                'flex items-center justify-between gap-2',
                className,
            )}
        >
            <div
                className={clsx(
                    'flex items-center gap-4 overflow-hidden',
                    titleClassName,
                )}
            >
                {href ? (
                    <Link href={href} className="hover:underline">
                        <Title>{title}</Title>
                    </Link>
                ) : onClick ? (
                    <button onClick={onClick} className="hover:underline">
                        <Title>{title}</Title>
                    </button>
                ) : (
                    <Title>{title}</Title>
                )}
                {children}
            </div>
            {href && (
                <Button size="icon-sm" variant="outline" asChild>
                    <Link href={href}>
                        <MaterialSymbolsArrowRightAltRounded className="text-lg" />
                    </Link>
                </Button>
            )}
            {onClick && (
                <Button size="icon-sm" variant="outline" onClick={onClick}>
                    <MaterialSymbolsArrowRightAltRounded className="text-lg" />
                </Button>
            )}
        </div>
    );
};

export default Component;
