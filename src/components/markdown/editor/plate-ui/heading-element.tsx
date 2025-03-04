'use client';

import { withRef, withVariants } from '@udecode/cn';
import { PlateElement } from '@udecode/plate/react';
import { cva } from 'class-variance-authority';

import { H1_CLASSNAME } from '@/components/typography/h1';
import { H2_CLASSNAME } from '@/components/typography/h2';
import { H3_CLASSNAME } from '@/components/typography/h3';
import { H4_CLASSNAME } from '@/components/typography/h4';
import { H5_CLASSNAME } from '@/components/typography/h5';

const headingVariants = cva('relative mb-1', {
    variants: {
        variant: {
            h1: H1_CLASSNAME,
            h2: H2_CLASSNAME,
            h3: H3_CLASSNAME,
            h4: H4_CLASSNAME,
            h5: H5_CLASSNAME,
            h6: 'mt-[0.75em] text-base font-semibold tracking-tight',
        },
    },
});

const HeadingElementVariants = withVariants(PlateElement, headingVariants, [
    'variant',
]);

export const HeadingElement = withRef<typeof HeadingElementVariants>(
    ({ children, variant = 'h1', ...props }, ref) => {
        return (
            <HeadingElementVariants
                ref={ref}
                as={variant!}
                variant={variant}
                {...props}
            >
                {children}
            </HeadingElementVariants>
        );
    },
);
