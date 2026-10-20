import type { FC, PropsWithChildren, ReactNode } from 'react';

import type { Href } from 'expo-router';
import { View } from 'react-native';

import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';

type Props = {
    title: string;
    href?: Href;
    onPress?: () => void;
    actions?: ReactNode;
};

const WidgetSection: FC<PropsWithChildren<Props>> = ({
    title,
    href,
    onPress,
    actions,
    children,
}) => {
    return (
        <View className="gap-3">
            <Header>
                <HeaderTitle href={href} onPress={onPress}>
                    {title}
                </HeaderTitle>
                {actions && <HeaderActions>{actions}</HeaderActions>}
            </Header>
            {children}
        </View>
    );
};

export default WidgetSection;
