'use client';

import React, { forwardRef, Ref, useState } from 'react';
import NextImage, { ImageProps } from 'next/image';
import clsx from 'clsx';

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
            className={clsx(
                loaded ? 'opacity-1' : 'opacity-0',
                !transitionDisabled && '!transition',
                className,
            )}
            onLoad={() => setLoaded(true)}
            // quality={85}
            alt={alt}
            {...props}
        />
    );
};

export default forwardRef(Component);
