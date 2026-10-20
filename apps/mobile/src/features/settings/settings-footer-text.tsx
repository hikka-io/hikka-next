import type { FC } from 'react';

import { Text } from '@expo/ui';
import { useCSSVariable } from 'uniwind';

import { useErrorColor } from './use-error-color';

type Props = {
    children: string;
    error?: boolean;
};

const FOOTER_FONT_SIZE = 13;

const SettingsFooterText: FC<Props> = ({ children, error }) => {
    const errorColor = useErrorColor();
    const muted = useCSSVariable('--color-muted-foreground');
    const color = error ? errorColor : muted;

    return (
        <Text
            textStyle={{
                fontSize: FOOTER_FONT_SIZE,
                color: typeof color === 'string' ? color : undefined,
            }}
        >
            {children}
        </Text>
    );
};

export default SettingsFooterText;
