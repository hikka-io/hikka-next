import type { FC } from 'react';

import { View } from 'react-native';

import ErrorState from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    isPending: boolean;
    error: unknown;
    onRetry: () => void;
};

/** What a settings screen shows until its data is in; null when the form can render. */
const SettingsLoading: FC<Props> = ({ isPending, error, onRetry }) => {
    if (error) {
        return (
            <View className="flex-1 justify-center bg-background">
                <ErrorState error={error} onRetry={onRetry} />
            </View>
        );
    }

    if (isPending) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <Spinner />
            </View>
        );
    }

    return null;
};

export default SettingsLoading;
