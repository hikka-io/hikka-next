import type { FC } from 'react';

import { type ErrorBoundaryProps, router } from 'expo-router';

import ErrorState from '@/components/ui/error-state';

const TITLE = 'Щось пішло не так';
const DESCRIPTION =
    'Сталася неочікувана помилка. Спробуйте ще раз або поверніться на головну.';
const ROOT_DESCRIPTION = 'Сталася неочікувана помилка. Спробуйте ще раз.';
const HOME_LABEL = 'На головну';

// A screen crash: the navigator is still mounted, so the way home works.
const RouteErrorBoundary: FC<ErrorBoundaryProps> = ({ error, retry }) => {
    const goHome = () => {
        if (router.canDismiss()) router.dismissAll();
        router.replace('/(tabs)/(home)');
        void retry();
    };

    return (
        <ErrorState
            title={TITLE}
            description={__DEV__ ? error.message : DESCRIPTION}
            onRetry={() => void retry()}
            secondaryAction={{ label: HOME_LABEL, onPress: goHome }}
        />
    );
};

// The root layout's own boundary replaces the navigator, so there is nothing to navigate with: retry only.
export const RootErrorBoundary: FC<ErrorBoundaryProps> = ({ error, retry }) => (
    <ErrorState
        title={TITLE}
        description={__DEV__ ? error.message : ROOT_DESCRIPTION}
        onRetry={() => void retry()}
    />
);

export default RouteErrorBoundary;
