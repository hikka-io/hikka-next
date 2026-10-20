import type { FC } from 'react';

import { FieldGroup, ListItem } from '@expo/ui';
import Constants from 'expo-constants';

import { useOpenLink } from '@/components/markdown';
import { siteUrl } from '@/utils/site-origin';

import SettingsForm from './settings-form';
import SettingsValueRow from './settings-value-row';

const LINKS = [
    { title: 'Правила', url: siteUrl('/articles/pravyla-saytu-9bcf83') },
    {
        title: 'Правовласникам',
        url: siteUrl('/articles/pravovlasnykam-a76512'),
    },
    { title: 'Telegram', url: 'https://t.me/hikka_io' },
    { title: 'GitHub', url: 'https://github.com/hikka-io' },
] as const;

const AboutSettings: FC = () => {
    const openLink = useOpenLink();

    return (
        <SettingsForm>
            <FieldGroup.Section title="Застосунок">
                <SettingsValueRow
                    title="Версія"
                    value={Constants.expoConfig?.version}
                />
            </FieldGroup.Section>
            <FieldGroup.Section title="Hikka">
                {LINKS.map((link) => (
                    <ListItem key={link.url} onPress={() => openLink(link.url)}>
                        {link.title}
                    </ListItem>
                ))}
            </FieldGroup.Section>
        </SettingsForm>
    );
};

export default AboutSettings;
