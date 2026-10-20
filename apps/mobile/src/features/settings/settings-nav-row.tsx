import type { FC } from 'react';

import { Icon } from '@expo/ui';
import { type Href, useRouter } from 'expo-router';
import { useCSSVariable } from 'uniwind';

import { CHEVRON_ICON } from './icons';
import SettingsListItem from './settings-list-item';

type Props = {
    title: string;
    href: Href;
    value?: string;
};

const SettingsNavRow: FC<Props> = ({ title, href, value }) => {
    const router = useRouter();
    const muted = useCSSVariable('--color-muted-foreground');

    return (
        <SettingsListItem
            onPress={() => router.push(href)}
            supportingText={value}
            trailing={
                <Icon
                    name={CHEVRON_ICON}
                    size={20}
                    color={typeof muted === 'string' ? muted : undefined}
                />
            }
        >
            {title}
        </SettingsListItem>
    );
};

export default SettingsNavRow;
