'use client';

import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded';

import Link from 'next/link';
import { Button } from '@/app/_components/ui/button';

interface Props extends PropsWithChildren {
    title: string;
    href?: string;
    variant?: 'h4' | 'h5';
    className?: string;
    titleClassName?: string;
}

const Component = ({
    title,
    href,
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
            <div className={clsx('flex items-center gap-8 overflow-hidden', titleClassName)}>
                <Title>{title}</Title>
                {children}
            </div>
            {href && (
                <Button size="icon-sm" variant="outline" asChild>
                    <Link
                        href={href}
                    >
                        <MaterialSymbolsArrowRightAltRounded className="text-xl" />
                    </Link>
                </Button>
            )}
        </div>
    );
};

export default Component;
