import type { FC } from 'react';

import { View } from 'react-native';

import { SkeletonText } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';

type Props = {
    label?: string;
};

// The inset fill is translucent, so the opaque page colour sits under it for a sticky header.
const NotificationSectionHeader: FC<Props> = ({ label }) => (
    <View className="bg-background">
        <View className="border-border border-b bg-surface-inset px-4 py-1.5">
            {label ? (
                <Text className="font-medium text-muted-foreground text-xs">
                    {label}
                </Text>
            ) : (
                <SkeletonText className="text-xs" barClassName="h-2 w-16" />
            )}
        </View>
    </View>
);

export default NotificationSectionHeader;
