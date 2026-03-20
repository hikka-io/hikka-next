'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

export function HeadingElement({
    variant = 'h1',
    ...props
}: PlateElementProps & { variant?: HeadingVariant }) {
    return (
        <PlateElement as={variant} className="relative" {...props}>
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
