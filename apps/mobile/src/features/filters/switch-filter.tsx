import type { FC } from 'react';

import { Host, Switch } from '@expo/ui';
import * as Haptics from 'expo-haptics';

import { useNativeTint } from './use-native-tint';

type Props = {
    label: string;
    value?: boolean;
    onChange: (value: boolean) => void;
};

const SwitchFilter: FC<Props> = ({ label, value = false, onChange }) => {
    const modifiers = useNativeTint();

    return (
        <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
            <Switch
                label={label}
                value={value}
                modifiers={modifiers}
                onValueChange={(next) => {
                    Haptics.selectionAsync();
                    onChange(next);
                }}
            />
        </Host>
    );
};

export default SwitchFilter;
