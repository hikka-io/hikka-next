import type { FC, ReactNode } from 'react';

import { FileSearch } from 'lucide-react-native';
import { View } from 'react-native';

import { cn } from '@/utils/cn';

import { Icon, IconClassContext } from './icon';
import { Text, wrapText } from './text';

type EmptyStateSize = 'sm' | 'md' | 'lg';

type Props = {
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    size?: EmptyStateSize;
    bordered?: boolean;
    className?: string;
};

const ROOT_SIZE: Record<EmptyStateSize, string> = {
    sm: 'gap-3 p-4',
    md: 'gap-4 p-6',
    lg: 'gap-5 p-8',
};

const HEADER_SIZE: Record<EmptyStateSize, string> = {
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-2',
};

const CHIP_SIZE: Record<EmptyStateSize, string> = {
    sm: 'size-9',
    md: 'size-10',
    lg: 'size-12',
};

const ICON_SIZE: Record<EmptyStateSize, string> = {
    sm: 'size-5',
    md: 'size-6',
    lg: 'size-7',
};

const TITLE_SIZE: Record<EmptyStateSize, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
};

const DESC_SIZE: Record<EmptyStateSize, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
};

const EmptyState: FC<Props> = ({
    title,
    description,
    icon,
    action,
    size = 'md',
    bordered = false,
    className,
}) => {
    return (
        <View
            className={cn(
                'min-w-0 flex-1 items-center justify-center rounded-lg',
                ROOT_SIZE[size],
                bordered && 'border border-border bg-secondary/20',
                className,
            )}
        >
            <View className={cn('max-w-sm items-center', HEADER_SIZE[size])}>
                <IconClassContext.Provider value={ICON_SIZE[size]}>
                    <View
                        className={cn(
                            'mb-2 items-center justify-center rounded-lg bg-muted',
                            CHIP_SIZE[size],
                        )}
                    >
                        {icon ?? <Icon as={FileSearch} />}
                    </View>
                </IconClassContext.Provider>
                <Text
                    className={cn(
                        'text-center font-medium tracking-tight',
                        TITLE_SIZE[size],
                    )}
                >
                    {title}
                </Text>
                {description && (
                    <Text
                        className={cn(
                            'text-center text-muted-foreground leading-relaxed',
                            DESC_SIZE[size],
                        )}
                    >
                        {description}
                    </Text>
                )}
            </View>
            {action && (
                <View className="w-full max-w-sm items-center gap-4">
                    {wrapText(action)}
                </View>
            )}
        </View>
    );
};

export default EmptyState;
