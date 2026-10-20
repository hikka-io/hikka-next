import type { FC } from 'react';

import SettingsListItem from './settings-list-item';

type Props = {
    title: string;
    value?: string;
};

const SettingsValueRow: FC<Props> = ({ title, value }) => (
    <SettingsListItem supportingText={value}>{title}</SettingsListItem>
);

export default SettingsValueRow;
