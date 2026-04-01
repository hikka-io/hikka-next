'use client';

import type { Operations } from '@unpic/core/base';
import {
    Image as UnpicImage,
    type ImageProps as UnpicImageProps,
} from '@unpic/react/base';
import { useCallback, useState } from 'react';

import { cn } from '@/utils/cn';
import { imgproxyTransformer } from '@/utils/imgproxy';

type Props = Omit<UnpicImageProps<Operations, undefined>, 'transformer'> & {
    transitionDisabled?: boolean;
    unoptimized?: boolean;
};

const Image = ({
    alt,
    className,
    transitionDisabled,
    background,
    unoptimized,
    src,
    onLoad,
    ...props
}: Props) => {
    const [loaded, setLoaded] = useState(false);

    const handleRef = useCallback((img: HTMLImageElement | null) => {
        if (img?.complete) {
            setLoaded(true);
        }
    }, []);

    const handleLoad = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            setLoaded(true);
            onLoad?.(e);
        },
        [onLoad],
    );

    const resolvedClassName = cn(
        'text-transparent',
        !transitionDisabled &&
            (loaded
                ? 'animate-[fade-in_0.2s_ease-in-out]'
                : 'opacity-0'),
        className,
    );

    const imageProps = {
        ...props,
        ref: handleRef,
        src,
        onLoad: handleLoad,
        transformer: (str, operations) =>
            imgproxyTransformer(str, operations, unoptimized),
        className: resolvedClassName,
        background: background ?? 'var(--muted)',
        alt: alt ?? '',
    } as UnpicImageProps<Operations, undefined>;

    return <UnpicImage {...imageProps} />;
};

export default Image;
