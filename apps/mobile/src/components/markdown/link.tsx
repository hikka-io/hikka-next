import type { FC, ReactNode } from 'react';

import { type Href, useRouter } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { Alert, Text } from 'react-native';

import { resolveLink } from './links';

type Props = {
    href: string;
    authenticated: boolean;
    children: ReactNode;
};

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

const Link: FC<Props> = ({ href, authenticated, children }) => {
    const openLink = useOpenLink();
    const target = resolveLink(href);

    if (target.kind === 'none') return <Text>{children}</Text>;

    if (target.kind === 'external' && target.authOnly && !authenticated) {
        return <Text className="text-muted-foreground">{children}</Text>;
    }

    return (
        <Text
            className="text-primary-foreground"
            accessibilityRole="link"
            onPress={() => openLink(href)}
        >
            {children}
        </Text>
    );
};

export default Link;
