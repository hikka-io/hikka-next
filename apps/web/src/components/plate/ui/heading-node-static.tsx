import { type VariantProps, cva } from 'class-variance-authority';
import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';
import * as React from 'react';

import { H1_CLASSNAME } from '@/components/typography/h1';
import { H2_CLASSNAME } from '@/components/typography/h2';
import { H3_CLASSNAME } from '@/components/typography/h3';
import { H4_CLASSNAME } from '@/components/typography/h4';
import { H5_CLASSNAME } from '@/components/typography/h5';

const headingVariants = cva('relative mb-4', {
    variants: {
        variant: {
            h1: H1_CLASSNAME,
            h2: H2_CLASSNAME,
            h3: H3_CLASSNAME,
            h4: H4_CLASSNAME,
            h5: H5_CLASSNAME,
        },
    },
});

export function HeadingElementStatic({
    variant = 'h1',
    ...props
}: SlateElementProps & VariantProps<typeof headingVariants>) {
    return (
        <SlateElement
            as={variant!}
            className={headingVariants({ variant })}
            {...props}
        >
            {props.children}
        </SlateElement>
    );
}

export function H1ElementStatic(props: SlateElementProps) {
    return <HeadingElementStatic variant="h1" {...props} />;
}

export function H2ElementStatic(
    props: React.ComponentProps<typeof HeadingElementStatic>,
) {
    return <HeadingElementStatic variant="h2" {...props} />;
}

export function H3ElementStatic(
    props: React.ComponentProps<typeof HeadingElementStatic>,
) {
    return <HeadingElementStatic variant="h3" {...props} />;
}

export function H4ElementStatic(
    props: React.ComponentProps<typeof HeadingElementStatic>,
) {
    return <HeadingElementStatic variant="h4" {...props} />;
}

export function H5ElementStatic(
    props: React.ComponentProps<typeof HeadingElementStatic>,
) {
    return <HeadingElementStatic variant="h5" {...props} />;
}
