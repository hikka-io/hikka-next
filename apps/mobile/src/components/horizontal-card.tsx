import type { FC, PropsWithChildren, ReactNode } from 'react';

import { type Href, Link } from 'expo-router';
import { Pressable, View, type ViewProps } from 'react-native';

import PosterCard from '@/components/content-card/poster-card';
import { Text, TextClassContext, wrapText } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

type HorizontalCardTitleProps = {
    className?: string;
    titleMeta?: ReactNode;
    numberOfLines?: number;
};

const HorizontalCardTitle: FC<PropsWithChildren<HorizontalCardTitleProps>> = ({
    children,
    className,
    titleMeta,
    numberOfLines = 1,
}) => {
    return (
        <View
            className={cn(
                'min-w-0 flex-row justify-between gap-2',
                numberOfLines > 1 ? 'items-baseline' : 'items-center',
            )}
        >
            <Text
                numberOfLines={numberOfLines}
                className={cn(
                    'min-w-0 flex-1 font-medium text-sm leading-tight',
                    className,
                )}
            >
                {children}
            </Text>
            {titleMeta}
        </View>
    );
};

type HorizontalCardDescriptionProps = {
    className?: string;
};

const HorizontalCardDescription: FC<
    PropsWithChildren<HorizontalCardDescriptionProps>
> = ({ children, className }) => {
    return (
        <TextClassContext.Provider value="text-xs text-muted-foreground">
            <View className={cn('flex-row items-center gap-2', className)}>
                {wrapText(children, {
                    numberOfLines: 1,
                    maxFontSizeMultiplier: DENSE_MAX_FONT_SCALE,
                })}
            </View>
        </TextClassContext.Provider>
    );
};

type HorizontalCardContainerProps = {
    className?: string;
};

const HorizontalCardContainer: FC<
    PropsWithChildren<HorizontalCardContainerProps>
> = ({ children, className }) => {
    return (
        <View className={cn('min-w-0 flex-1 flex-col gap-2', className)}>
            {children}
        </View>
    );
};

type HorizontalCardImageProps = {
    className?: string;
    imageClassName?: string;
    imageRatio?: number;
    image: string | ReactNode;
    imageBlur?: boolean;
};

const HorizontalCardImage: FC<PropsWithChildren<HorizontalCardImageProps>> = ({
    children,
    imageRatio,
    image,
    className,
    imageClassName,
    imageBlur,
}) => {
    return (
        <PosterCard
            className={cn('w-12', className)}
            containerClassName={cn(
                imageClassName,
                imageRatio !== 1 && 'rounded-lg',
            )}
            containerRatio={imageRatio}
            image={image}
            imageBlur={imageBlur}
        >
            {children}
        </PosterCard>
    );
};

type Props = ViewProps & {
    href?: Href;
    onPress?: () => void;
    action?: ReactNode;
    // The label and hint of the row's one pressable, so a screen reader announces more than the visible text.
    accessibilityLabel?: string;
    accessibilityHint?: string;
};

const HorizontalCard: FC<Props> = ({
    className,
    children,
    href,
    onPress,
    action,
    accessibilityLabel,
    accessibilityHint,
    ...props
}) => {
    if (!href && !onPress) {
        return (
            <View
                className={cn('flex-row items-center gap-4', className)}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                {...props}
            >
                {children}
                {action}
            </View>
        );
    }

    const row = (
        <Pressable
            accessibilityRole="link"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            onPress={onPress}
            className="min-h-11 min-w-0 flex-1 flex-row items-center gap-4 active:opacity-70"
        >
            {children}
        </Pressable>
    );

    return (
        <View
            className={cn('flex-row items-center gap-4', className)}
            {...props}
        >
            {href ? (
                <Link href={href} asChild>
                    {row}
                </Link>
            ) : (
                row
            )}
            {action}
        </View>
    );
};

export {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
};
