import type { ComponentProps, FC, ReactNode } from 'react';

import { View, type ViewProps } from 'react-native';

import { cn } from '@/utils/cn';

import Image from './image';
import { wrapText } from './text';

const Avatar: FC<ViewProps> = ({ className, ...props }) => {
    return (
        <View
            className={cn(
                'relative size-10 shrink-0 overflow-hidden rounded-full',
                className,
            )}
            {...props}
        />
    );
};

type AvatarImageProps = Omit<ComponentProps<typeof Image>, 'source'> & {
    src?: string | null;
    alt?: string;
};

const AvatarImage: FC<AvatarImageProps> = ({
    className,
    src,
    alt,
    ...props
}) => {
    if (!src) return null;

    return (
        <Image
            source={src}
            accessibilityLabel={alt}
            contentFit="cover"
            transition={150}
            className={cn('absolute inset-0 z-10 size-full', className)}
            {...props}
        />
    );
};

type AvatarFallbackProps = ViewProps & {
    children?: ReactNode;
};

const AvatarFallback: FC<AvatarFallbackProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <View
            className={cn(
                'absolute inset-0 items-center justify-center rounded-full bg-muted',
                className,
            )}
            {...props}
        >
            {wrapText(children, { className: 'font-medium text-sm' })}
        </View>
    );
};

export { Avatar, AvatarFallback, AvatarImage };
