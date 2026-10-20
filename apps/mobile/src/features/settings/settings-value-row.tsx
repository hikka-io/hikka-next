import type { FC } from 'react';

import { ListItem } from '@expo/ui';

type Props = {
    title: string;
    value?: string;
};

const SettingsValueRow: FC<Props> = ({ title, value }) => (
    <ListItem supportingText={value}>{title}</ListItem>
);

export default SettingsValueRow;
