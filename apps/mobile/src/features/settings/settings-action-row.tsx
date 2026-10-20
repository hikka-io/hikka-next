import type { FC } from 'react';

import { alpha, semantics } from '@expo/ui/jetpack-compose/modifiers';
import { useCSSVariable } from 'uniwind';

import SettingsListItem from './settings-list-item';

type Props = {
    title: string;
    onPress: () => void;
    destructive?: boolean;
    disabled?: boolean;
};

const DISABLED_ALPHA = 0.38;

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
        <SettingsListItem
            onPress={disabled ? undefined : onPress}
            colors={{
                contentColor: typeof color === 'string' ? color : undefined,
            }}
            modifiers={
                disabled
                    ? [
                          alpha(DISABLED_ALPHA),
                          semantics({
                              contentDescription: `${title}, недоступно`,
                          }),
                      ]
                    : undefined
            }
        >
            {title}
        </SettingsListItem>
    );
};

export default SettingsActionRow;
