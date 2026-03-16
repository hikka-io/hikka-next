'use client';

import {
    type ImageProps as UnpicImageProps,
    Image as UnpicImage,
} from '@unpic/react/base';
import type { Operations } from '@unpic/core/base';

import { cn } from '@/utils/cn';
import { imgproxyTransformer } from '@/utils/imgproxy';

type Props = Omit<UnpicImageProps<Operations, undefined>, 'transformer'> & {
    transitionDisabled?: boolean;
};

const Image = ({
    alt,
    className,
    transitionDisabled,
    background,
    ...props
}: Props) => {
    const imageProps = {
        ...props,
        transformer: imgproxyTransformer,
        className: cn(
            !transitionDisabled && 'animate-[fade-in_0.2s_ease-in-out]',
            className,
        ),
        background: background ?? 'var(--muted)',
        alt: alt ?? '',
    } as UnpicImageProps<Operations, undefined>;

    return <UnpicImage {...imageProps} />;
};

export default Image;
