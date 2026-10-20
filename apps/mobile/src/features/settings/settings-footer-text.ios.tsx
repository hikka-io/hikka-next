import type { FC } from 'react';

import { Text } from '@expo/ui/swift-ui';
import { foregroundColor } from '@expo/ui/swift-ui/modifiers';

import { useErrorColor } from './use-error-color';

type Props = {
    children: string;
    error?: boolean;
};

// A section footer line: secondary like the system's, in the error color for a validation message.
const SettingsFooterText: FC<Props> = ({ children, error }) => {
    const errorColor = useErrorColor();

    return (
        <Text
            modifiers={
                error && errorColor ? [foregroundColor(errorColor)] : undefined
            }
        >
            {children}
        </Text>
    );
};

export default SettingsFooterText;
