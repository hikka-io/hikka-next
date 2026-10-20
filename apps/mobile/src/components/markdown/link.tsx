import type { FC, ReactNode } from 'react';

import { Text } from 'react-native';

import { resolveLink } from './links';
import { useOpenLink } from './use-open-link';

type Props = {
    href: string;
    authenticated: boolean;
    children: ReactNode;
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
