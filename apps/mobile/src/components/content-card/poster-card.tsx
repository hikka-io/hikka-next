import { type FC, type ReactNode, useState } from 'react';

import { type Href, Link } from 'expo-router';
import { Eye, ImageOff } from 'lucide-react-native';
import { type GestureResponderEvent, Pressable, View } from 'react-native';

import { DEFAULT_CONTAINER_RATIO } from '@hikka/core';

import { Icon } from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

const BLUR_RADIUS = 24;
const HIDDEN_LABEL = 'Прихований вміст';
const REVEAL_HINT = 'Торкніться, щоб показати';

type Props = {
    title?: string | null;
    description?: string | null;
    leftSubtitle?: string | null;
    rightSubtitle?: string | null;
    image?: string | ReactNode;
    href?: Href;
    containerRatio?: number;
    imageClassName?: string;
    containerClassName?: string;
    titleClassName?: string;
    className?: string;
    children?: ReactNode;
    overlay?: ReactNode;
    onPress?: () => void;
    imageBlur?: boolean;
    titleBlur?: boolean;
};

const PosterCard: FC<Props> = ({
    title,
    description,
    leftSubtitle,
    rightSubtitle,
    image,
    href,
    containerRatio = DEFAULT_CONTAINER_RATIO,
    imageClassName,
    containerClassName,
    titleClassName,
    className,
    children,
    overlay,
    onPress,
    imageBlur,
    titleBlur,
}) => {
    const [revealed, setRevealed] = useState(false);
    const hidden = Boolean(imageBlur || titleBlur) && !revealed;
    const hasSubtitles = Boolean(leftSubtitle || rightSubtitle);
    const pressable = Boolean(href || onPress || hidden);

    const poster =
        typeof image === 'string' ? (
            <Image
                source={image}
                contentFit="cover"
                transition={150}
                recyclingKey={image}
                blurRadius={imageBlur && hidden ? BLUR_RADIUS : 0}
                accessibilityIgnoresInvertColors
                className={cn('absolute inset-0 size-full', imageClassName)}
            />
        ) : (
            (image ?? (
                <Icon as={ImageOff} className="size-9 text-muted-foreground" />
            ))
        );

    const content = (
        <>
            <View
                style={{ aspectRatio: containerRatio }}
                className={cn(
                    'relative w-full items-center justify-center overflow-hidden rounded-md bg-muted',
                    containerClassName,
                )}
            >
                {poster}
                {imageBlur && hidden && (
                    <View className="absolute inset-0 items-center justify-center">
                        <View className="size-8 items-center justify-center rounded-full bg-black/40">
                            <Icon as={Eye} className="size-4 text-white" />
                        </View>
                    </View>
                )}
                {children}
            </View>
            {(title || description) && (
                <View className="mt-1">
                    {description && (
                        <Text
                            numberOfLines={1}
                            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                            className="mb-1 text-muted-foreground text-xs"
                        >
                            {description}
                        </Text>
                    )}
                    {title && (
                        <Text
                            numberOfLines={hasSubtitles ? 1 : 2}
                            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                            className={cn(
                                'font-medium text-sm leading-5',
                                titleBlur && hidden && 'opacity-0',
                                titleClassName,
                            )}
                        >
                            {title}
                        </Text>
                    )}
                    {hasSubtitles && (
                        <View className="mt-1 flex-row items-center gap-2">
                            {leftSubtitle && (
                                <Text
                                    numberOfLines={1}
                                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                                    className="shrink font-medium text-muted-foreground text-xs leading-tight"
                                >
                                    {leftSubtitle}
                                </Text>
                            )}
                            {leftSubtitle && rightSubtitle && (
                                <View className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                            )}
                            {rightSubtitle && (
                                <Text
                                    numberOfLines={1}
                                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                                    className="shrink font-medium text-muted-foreground text-xs leading-tight"
                                >
                                    {rightSubtitle}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            )}
        </>
    );

    const handlePress = (
        event: Pick<GestureResponderEvent, 'preventDefault'>,
    ) => {
        if (hidden) {
            event.preventDefault();
            setRevealed(true);
            return;
        }
        onPress?.();
    };

    const card = pressable ? (
        <Pressable
            accessibilityRole="link"
            accessibilityLabel={
                titleBlur && hidden ? HIDDEN_LABEL : (title ?? undefined)
            }
            accessibilityHint={hidden ? REVEAL_HINT : undefined}
            onPress={href ? undefined : handlePress}
            className="w-full flex-col gap-2 active:opacity-70"
        >
            {content}
        </Pressable>
    ) : (
        <View className="w-full flex-col gap-2">{content}</View>
    );

    return (
        <View className={cn('relative w-full', className)}>
            {href ? (
                <Link href={href} onPress={handlePress} asChild>
                    {card}
                </Link>
            ) : (
                card
            )}
            {overlay && (
                <View
                    pointerEvents="box-none"
                    style={{ aspectRatio: containerRatio }}
                    className="absolute inset-x-0 top-0"
                >
                    {overlay}
                </View>
            )}
        </View>
    );
};

export default PosterCard;
