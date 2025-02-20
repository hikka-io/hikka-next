'use client';

import NextImage, { ImageProps } from 'next/image';
import { Ref, forwardRef, useState } from 'react';

import { cn } from '@/utils/utils';

interface Props extends ImageProps {
    transitionDisabled?: boolean;
}

const Component = (
    { alt, className, transitionDisabled, ...props }: Props,
    ref: Ref<HTMLImageElement>,
) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <NextImage
            ref={ref}
            className={cn(
                '[overflow-clip-margin:unset]',
                loaded ? 'opacity-100' : 'opacity-0',
                !transitionDisabled && '!transition',
                className,
            )}
            onLoad={() => setLoaded(true)}
            quality={85}
            alt={alt}
            {...props}
        />
    );
};

export default forwardRef(Component);
