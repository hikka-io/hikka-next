import type { FC } from 'react';

import { Text } from '@expo/ui';

import { useErrorColor } from './use-error-color';

type Props = {
    children: string;
    error?: boolean;
};

const SettingsFooterText: FC<Props> = ({ children, error }) => {
    const errorColor = useErrorColor();

    return (
        <Text textStyle={error ? { color: errorColor } : undefined}>
            {children}
        </Text>
    );
};

export default SettingsFooterText;
