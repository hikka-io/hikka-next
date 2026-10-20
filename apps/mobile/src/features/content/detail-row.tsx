import type { FC, ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type Props = {
    icon: LucideIcon;
    title: string;
    value?: string | number | null;
    children?: ReactNode;
};

const DetailRow: FC<Props> = ({ icon, title, value, children }) => {
    if (!children && (value === undefined || value === null || value === '')) {
        return null;
    }

    return (
        <View accessible={!children} className="flex-row items-start gap-2">
            <View className="flex-1 flex-row items-center gap-3">
                <Icon as={icon} className="size-4 text-muted-foreground" />
                <Text
                    numberOfLines={2}
                    className="flex-1 font-medium text-muted-foreground text-sm leading-tight"
                >
                    {title}
                </Text>
            </View>
            <View className="flex-1 flex-row items-center justify-end">
                {children ?? (
                    <Text
                        numberOfLines={2}
                        className="text-right font-medium text-sm leading-tight"
                    >
                        {value}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default DetailRow;
