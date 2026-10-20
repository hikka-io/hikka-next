import type { FC } from 'react';

import { Button } from '@expo/ui/swift-ui';
import { disabled as disabledModifier } from '@expo/ui/swift-ui/modifiers';

type Props = {
    title: string;
    onPress: () => void;
    destructive?: boolean;
    disabled?: boolean;
};

// A plain Form button: tinted by default, red for a destructive role.
const SettingsActionRow: FC<Props> = ({
    title,
    onPress,
    destructive,
    disabled,
}) => (
    <Button
        label={title}
        role={destructive ? 'destructive' : undefined}
        onPress={onPress}
        modifiers={disabled ? [disabledModifier(true)] : undefined}
    />
);

export default SettingsActionRow;
