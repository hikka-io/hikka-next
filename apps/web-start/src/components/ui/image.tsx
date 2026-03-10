'use client';

import { type ImageProps, Image as UnpicImage } from '@unpic/react';
import { type Ref, forwardRef } from 'react';

import { cn } from '@/utils/cn';

type Props = ImageProps & {
    transitionDisabled?: boolean;
};

const Component = (
    { alt, className, transitionDisabled, onLoad, ...props }: Props,
    ref: Ref<HTMLImageElement>,
) => {
    return (
        <UnpicImage
            ref={ref}
            className={cn(className)}
            alt={alt ?? ''}
            {...props}
        />
    );
};

export default forwardRef(Component);
