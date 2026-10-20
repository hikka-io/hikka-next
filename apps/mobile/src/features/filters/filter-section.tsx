import type { FC, PropsWithChildren, ReactNode } from 'react';

import { View } from 'react-native';

import { Header, HeaderTitle } from '@/components/ui/header';
import { Text } from '@/components/ui/text';

type Props = {
    title: string;
    value?: ReactNode;
};

const FilterSection: FC<PropsWithChildren<Props>> = ({
    title,
    value,
    children,
}) => {
    return (
        <View className="gap-3">
            <Header className="justify-between">
                <HeaderTitle size="subsection">{title}</HeaderTitle>
                {value ? (
                    <Text className="text-muted-foreground text-sm">
                        {value}
                    </Text>
                ) : null}
            </Header>
            {children}
        </View>
    );
};

export default FilterSection;
