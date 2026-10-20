import type { FC } from 'react';

import { Icon } from '@expo/ui';
import { semantics } from '@expo/ui/jetpack-compose/modifiers';
import { View } from 'react-native';

import { CHECK_ICON } from '../icons';
import SettingsListItem from '../settings-list-item';

type Props = {
    name: string;
    color: string;
    selected: boolean;
    onPress: () => void;
};

const AccentRow: FC<Props> = ({ name, color, selected, onPress }) => (
    <SettingsListItem
        onPress={onPress}
        modifiers={[
            semantics({
                contentDescription: selected ? `${name}, вибрано` : name,
            }),
        ]}
        leading={
            <View
                className="size-6 rounded-full"
                style={{ backgroundColor: color }}
            />
        }
        trailing={selected ? <Icon name={CHECK_ICON} size={20} /> : undefined}
    >
        {name}
    </SettingsListItem>
);

export default AccentRow;
