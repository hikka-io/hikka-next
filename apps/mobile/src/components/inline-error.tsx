import type { FC } from 'react';

import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';

type Props = {
    onRetry: () => void;
    className?: string;
};

const InlineError: FC<Props> = ({ onRetry, className }) => (
    <View className={cn('items-start gap-2', className)}>
        <Text className="text-destructive-foreground text-sm">
            Не вдалося завантажити
        </Text>
        <Button variant="outline" size="md" onPress={onRetry}>
            Повторити
        </Button>
    </View>
);

export default InlineError;
