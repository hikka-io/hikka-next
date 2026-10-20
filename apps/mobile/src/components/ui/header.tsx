import type { FC, PropsWithChildren } from 'react';

import { type Href, Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { cn } from '@/utils/cn';

import { Icon } from './icon';
import { Skeleton } from './skeleton';
import { Text } from './text';
import { DENSE_MAX_FONT_SCALE } from './typography';

const TITLE_SIZES = {
    page: 'text-2xl leading-8 font-bold',
    section: 'text-lg leading-7 font-bold',
    subsection: 'text-base leading-6 font-semibold',
} as const;

const ICON_SIZES = {
    page: 'size-6',
    section: 'size-4.5',
    subsection: 'size-4',
} as const;

type HeaderProps = {
    className?: string;
};

const Header: FC<PropsWithChildren<HeaderProps>> = ({
    className,
    children,
}) => {
    return (
        <View className={cn('min-h-8 flex-row items-center gap-3', className)}>
            {children}
        </View>
    );
};

type HeaderCountProps = {
    count?: number;
    pending?: boolean;
    size: keyof typeof TITLE_SIZES;
};

const HeaderCount: FC<HeaderCountProps> = ({ count, pending, size }) => {
    if (count !== undefined) {
        return (
            <Text
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                className={cn(
                    TITLE_SIZES[size],
                    'ml-1 font-medium text-muted-foreground tabular-nums',
                )}
            >
                {count}
            </Text>
        );
    }

    if (pending) {
        return <Skeleton className="ml-1 h-4 w-6" />;
    }

    return null;
};

type HeaderTitleProps = {
    className?: string;
    size?: keyof typeof TITLE_SIZES;
    href?: Href;
    onPress?: () => void;
    truncate?: boolean;
    count?: number;
    countPending?: boolean;
};

const HeaderTitle: FC<PropsWithChildren<HeaderTitleProps>> = ({
    className,
    children,
    size = 'section',
    href,
    onPress,
    truncate,
    count,
    countPending,
}) => {
    const title = (
        <Text
            accessibilityRole="header"
            numberOfLines={truncate ? 1 : undefined}
            className={cn(TITLE_SIZES[size], 'shrink')}
        >
            {children}
        </Text>
    );
    const countSlot = (
        <HeaderCount count={count} pending={countPending} size={size} />
    );

    if (!href && !onPress) {
        return (
            <View
                className={cn(
                    'flex-row items-center',
                    truncate && 'min-w-0 shrink',
                    className,
                )}
            >
                {title}
                {countSlot}
            </View>
        );
    }

    const trigger = (
        <Pressable
            role="heading"
            onPress={onPress}
            className={cn(
                '-mx-1.5 min-h-11 flex-row items-center gap-1 rounded-md px-1.5 active:opacity-60',
                truncate && 'min-w-0 shrink',
                className,
            )}
        >
            {title}
            {countSlot}
            <Icon
                as={ChevronRight}
                className={cn(ICON_SIZES[size], 'text-muted-foreground')}
            />
        </Pressable>
    );

    return href ? (
        <Link href={href} asChild>
            {trigger}
        </Link>
    ) : (
        trigger
    );
};

type HeaderActionsProps = {
    className?: string;
};

const HeaderActions: FC<PropsWithChildren<HeaderActionsProps>> = ({
    className,
    children,
}) => {
    return (
        <View
            className={cn(
                'ml-auto shrink-0 flex-row items-center gap-2',
                className,
            )}
        >
            {children}
        </View>
    );
};

export { Header, HeaderActions, HeaderTitle };
