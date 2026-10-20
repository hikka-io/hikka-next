import type { FC } from 'react';

import { Switch } from '@expo/ui';
import * as Haptics from 'expo-haptics';

type Props = {
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
};

const SettingsSwitchRow: FC<Props> = ({
    title,
    value,
    onValueChange,
    disabled,
}) => (
    <Switch
        label={title}
        value={value}
        disabled={disabled}
        onValueChange={(next) => {
            Haptics.selectionAsync();
            onValueChange(next);
        }}
    />
);

export default SettingsSwitchRow;
