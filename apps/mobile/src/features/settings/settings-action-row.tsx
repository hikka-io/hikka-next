import type { FC } from 'react';

import { ListItem } from '@expo/ui';
import { useCSSVariable } from 'uniwind';

type Props = {
    title: string;
    onPress: () => void;
    destructive?: boolean;
    disabled?: boolean;
};

const SettingsActionRow: FC<Props> = ({
    title,
    onPress,
    destructive,
    disabled,
}) => {
    const destructiveColor = useCSSVariable('--color-destructive-foreground');
    const primaryColor = useCSSVariable('--color-primary-foreground');
    const color = destructive ? destructiveColor : primaryColor;

    return (
        <ListItem
            onPress={disabled ? undefined : onPress}
            colors={{
                contentColor: typeof color === 'string' ? color : undefined,
            }}
        >
            {title}
        </ListItem>
    );
};

export default SettingsActionRow;
