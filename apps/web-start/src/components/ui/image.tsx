'use client';

import { ImgHTMLAttributes, Ref, forwardRef, useState } from 'react';

import { cn } from '@/utils/cn';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
    transitionDisabled?: boolean;
    quality?: number;
    priority?: boolean;
}

const Component = (
    { alt, className, transitionDisabled, quality: _quality, priority: _priority, loading, ...props }: Props,
    ref: Ref<HTMLImageElement>,
) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <img
            ref={ref}
            className={cn(
                loaded ? 'opacity-100' : 'opacity-0',
                !transitionDisabled && '!transition',
                className,
            )}
            onLoad={() => setLoaded(true)}
            loading={loading ?? 'lazy'}
            alt={alt}
            {...props}
        />
    );
};

export default forwardRef(Component);
