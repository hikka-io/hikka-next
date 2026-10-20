import type { FC } from 'react';

import { View } from 'react-native';

import { HikkaApiError } from '@hikka/api';
import { apiErrorMessage } from '@hikka/core';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';

type Props = {
    error: unknown;
    onRetry: () => void;
    notFoundTitle?: string;
};

const ErrorState: FC<Props> = ({
    error,
    onRetry,
    notFoundTitle = 'Сторінку не знайдено',
}) => {
    const notFound = error instanceof HikkaApiError && error.status === 404;

    return (
        <View className="flex-1 items-center justify-center gap-3 bg-background p-6">
            {notFound ? (
                <EmptyState
                    title={notFoundTitle}
                    description="Вона не існує або була переміщена"
                />
            ) : (
                <>
                    <EmptyState
                        title="Не вдалося завантажити"
                        description={apiErrorMessage(
                            error,
                            'Перевірте інтернет і спробуйте ще раз',
                        )}
                    />
                    <Button variant="outline" onPress={onRetry}>
                        Повторити
                    </Button>
                </>
            )}
        </View>
    );
};

export default ErrorState;
