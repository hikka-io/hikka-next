import type { FC } from 'react';

import { Row, Switch, Text } from '@expo/ui/jetpack-compose';
import {
    clickable,
    fillMaxWidth,
    padding,
    weight,
} from '@expo/ui/jetpack-compose/modifiers';
import * as Haptics from 'expo-haptics';

type Props = {
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
};

// The labeled universal Switch sets a string width that Expo Go 57.0.0's native module rejects (a crash), so the row is composed here.
const SettingsSwitchRow: FC<Props> = ({
    title,
    value,
    onValueChange,
    disabled,
}) => {
    const toggle = (next: boolean) => {
        Haptics.selectionAsync();
        onValueChange(next);
    };

    return (
        <Row
            verticalAlignment="center"
            horizontalArrangement={{ spacedBy: 16 }}
            modifiers={[
                fillMaxWidth(),
                ...(disabled ? [] : [clickable(() => toggle(!value))]),
                padding(0, 4, 0, 4),
            ]}
        >
            <Text modifiers={[weight(1)]}>{title}</Text>
            <Switch
                value={value}
                enabled={!disabled}
                onCheckedChange={disabled ? undefined : toggle}
            />
        </Row>
    );
};

export default SettingsSwitchRow;
