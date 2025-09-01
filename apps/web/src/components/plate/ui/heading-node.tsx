'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

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

export function HeadingElement({
    variant = 'h1',
    ...props
}: PlateElementProps & VariantProps<typeof headingVariants>) {
    return (
        <PlateElement
            as={variant!}
            className={headingVariants({ variant })}
            {...props}
        >
            {props.children}
        </PlateElement>
    );
}

export function H1Element(props: PlateElementProps) {
    return <HeadingElement variant="h1" {...props} />;
}

export function H2Element(props: PlateElementProps) {
    return <HeadingElement variant="h2" {...props} />;
}

export function H3Element(props: PlateElementProps) {
    return <HeadingElement variant="h3" {...props} />;
}

export function H4Element(props: PlateElementProps) {
    return <HeadingElement variant="h4" {...props} />;
}

export function H5Element(props: PlateElementProps) {
    return <HeadingElement variant="h5" {...props} />;
}
