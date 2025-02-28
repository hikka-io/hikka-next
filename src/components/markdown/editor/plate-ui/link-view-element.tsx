'use client';

import { cn, withRef } from '@udecode/cn';
import { useElement } from '@udecode/plate-common/react';
import type { TLinkElement } from '@udecode/plate-link';
import { useLink } from '@udecode/plate-link/react';

import Link from '@/components/typography/link';

import { PlateElement } from './plate-element';

export const LinkViewElement = withRef<typeof PlateElement>(
    ({ children, className }, ref) => {
        const element = useElement<TLinkElement>();
        const { props: linkProps } = useLink({ element });

        return (
            <Link ref={ref} className={cn(className)} {...(linkProps as any)}>
                {children}
            </Link>
        );
    },
);
