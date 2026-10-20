import type { FC, ReactNode } from 'react';

import { View } from 'react-native';

import { Text } from '@/components/ui/text';

type Props = {
    title: string;
    children: ReactNode;
};

const AuthHeader: FC<Props> = ({ title, children }) => (
    <View className="gap-1">
        <Text className="font-bold text-2xl text-foreground">{title}</Text>
        <Text className="text-muted-foreground text-sm">{children}</Text>
    </View>
);

export default AuthHeader;
