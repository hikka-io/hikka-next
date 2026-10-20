import { type Href, useRouter } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { Alert } from 'react-native';

import { resolveLink } from './links';

export const useOpenLink = () => {
    const router = useRouter();

    return (href: string) => {
        const target = resolveLink(href);

        if (target.kind === 'route') {
            router.push(target.href as Href);
            return;
        }

        if (target.kind === 'none') return;

        if (target.trusted) {
            openBrowserAsync(target.url);
            return;
        }

        Alert.alert('Ви впевнені, що хочете відкрити посилання?', target.url, [
            { text: 'Відмінити', style: 'cancel' },
            { text: 'Продовжити', onPress: () => openBrowserAsync(target.url) },
        ]);
    };
};
