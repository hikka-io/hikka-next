import type { FC, PropsWithChildren } from 'react';

import { FieldGroup, Host } from '@expo/ui';
import { useColorScheme } from 'react-native';
import { useCSSVariable } from 'uniwind';

// Native grouped list: SwiftUI `Form` on iOS, Material connected list on Android. The host takes the
// scheme (Compose does not follow the system by itself) and the brand tint, like the other native controls.
const SettingsForm: FC<PropsWithChildren> = ({ children }) => {
    const scheme = useColorScheme();
    const tint = useCSSVariable('--color-primary-foreground');

    return (
        <Host
            style={{ flex: 1 }}
            colorScheme={scheme}
            seedColor={typeof tint === 'string' ? tint : undefined}
        >
            <FieldGroup>{children}</FieldGroup>
        </Host>
    );
};

export default SettingsForm;
