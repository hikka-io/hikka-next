import type { FC } from 'react';

import { Link } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Text } from '@/components/ui/text';

const JoinCard: FC = () => {
    return (
        <Card>
            <View className="gap-2">
                <Text className="font-bold text-sm">Приєднуйся до hikka</Text>
                <Text className="text-muted-foreground text-xs">
                    Відслідковуй свій прогрес, створюй власні колекції та веди
                    обговорення зі спільнотою
                </Text>
            </View>
            <Link href="/login" asChild>
                <Button
                    variant="secondary"
                    size="md"
                    containerClassName="self-stretch"
                    className="w-full"
                >
                    Увійти
                </Button>
            </Link>
        </Card>
    );
};

export default JoinCard;
