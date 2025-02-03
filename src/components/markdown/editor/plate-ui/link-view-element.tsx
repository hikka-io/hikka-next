'use client';

import { cn, withRef } from '@udecode/cn';
import { useElement } from '@udecode/plate-common/react';
import type { TLinkElement } from '@udecode/plate-link';
import { useLink } from '@udecode/plate-link/react';
import Link from 'next/link';

import { PlateElement } from './plate-element';

export const LinkViewElement = withRef<typeof PlateElement>(
    ({ children, className, ...props }, ref) => {
        const element = useElement<TLinkElement>();
        const { props: linkProps } = useLink({ element });

        return (
            <Link
                ref={ref}
                className={cn(
                    'font-medium text-primary hover:underline',
                    className,
                )}
                {...(linkProps as any)}
                {...props}
            >
                {children}
            </Link>
        );
    },
);
