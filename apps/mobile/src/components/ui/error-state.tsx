import type { FC } from 'react';

import { CircleAlert } from 'lucide-react-native';
import { View } from 'react-native';

import { apiErrorMessage } from '@hikka/core';

import { cn } from '@/utils/cn';

import { Button } from './button';
import EmptyState from './empty-state';
import { Icon } from './icon';
import { Text } from './text';

const ERROR_TITLE = 'Не вдалося завантажити';
const ERROR_FALLBACK = 'Перевірте зʼєднання та спробуйте ще раз';
const RETRY_TEXT = 'Повторити';

type Variant = 'page' | 'section' | 'inline';

type Props = {
    error?: unknown;
    onRetry: () => void;
    // `page` fills a screen or list, `section` replaces one block's content, `inline` sits in a row or card.
    variant?: Variant;
    title?: string;
    // Detail pages pass it for a 404 (`isNotFoundError`) or a profile without a username; lists never do.
    notFound?: boolean;
    notFoundTitle?: string;
    // `page` only: replaces the message derived from `error`, e.g. for a render error whose text is not for people.
    description?: string;
    // `page` only: a second, quieter action beside the retry.
    secondaryAction?: { label: string; onPress: () => void };
    className?: string;
};

const ErrorState: FC<Props> = ({
    error,
    onRetry,
    variant = 'page',
    title = ERROR_TITLE,
    notFound,
    notFoundTitle = 'Сторінку не знайдено',
    description,
    secondaryAction,
    className,
}) => {
    const retry = () => onRetry();

    if (variant === 'inline') {
        return (
            <View className={cn('items-start gap-2', className)}>
                <Text className="text-destructive-foreground text-sm">
                    {title}
                </Text>
                <Button variant="outline" size="md" onPress={retry}>
                    {RETRY_TEXT}
                </Button>
            </View>
        );
    }

    if (variant === 'section') {
        return (
            <EmptyState
                size="sm"
                bordered
                icon={<Icon as={CircleAlert} />}
                title={title}
                action={
                    <Button variant="secondary" size="md" onPress={retry}>
                        {RETRY_TEXT}
                    </Button>
                }
                className={className}
            />
        );
    }

    if (notFound) {
        return (
            <EmptyState
                title={notFoundTitle}
                description="Вона не існує або була переміщена"
                className={cn('bg-background', className)}
            />
        );
    }

    return (
        <EmptyState
            icon={<Icon as={CircleAlert} />}
            title={title}
            description={description ?? apiErrorMessage(error, ERROR_FALLBACK)}
            action={
                <View className="items-center gap-2">
                    <Button variant="secondary" onPress={retry}>
                        {RETRY_TEXT}
                    </Button>
                    {secondaryAction && (
                        <Button
                            variant="ghost"
                            onPress={secondaryAction.onPress}
                        >
                            {secondaryAction.label}
                        </Button>
                    )}
                </View>
            }
            className={cn('bg-background', className)}
        />
    );
};

export default ErrorState;
