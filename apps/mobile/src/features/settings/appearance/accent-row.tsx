import type { FC } from 'react';

import { Icon, ListItem } from '@expo/ui';
import { View } from 'react-native';

import { CHECK_ICON } from '../icons';

type Props = {
    name: string;
    color: string;
    selected: boolean;
    onPress: () => void;
};

const AccentRow: FC<Props> = ({ name, color, selected, onPress }) => (
    <ListItem
        onPress={onPress}
        leading={
            <View
                className="size-6 rounded-full"
                style={{ backgroundColor: color }}
            />
        }
        trailing={selected ? <Icon name={CHECK_ICON} size={20} /> : undefined}
    >
        {name}
    </ListItem>
);

export default AccentRow;
