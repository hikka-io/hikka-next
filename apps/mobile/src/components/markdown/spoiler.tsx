import type { FC, ReactNode } from 'react';
import { useState } from 'react';

import { Pressable, Text, View } from 'react-native';

type Props = {
    children: ReactNode;
};

const CLAMP = 88;

const Spoiler: FC<Props> = ({ children }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <View className="gap-2 overflow-hidden rounded-lg border border-border bg-muted p-2">
            <View
                style={revealed ? undefined : { maxHeight: CLAMP }}
                className="overflow-hidden"
            >
                <View
                    className={revealed ? undefined : 'opacity-0'}
                    importantForAccessibility={
                        revealed ? 'auto' : 'no-hide-descendants'
                    }
                    accessibilityElementsHidden={!revealed}
                >
                    {children}
                </View>
            </View>
            {revealed ? (
                <Text
                    accessibilityRole="button"
                    className="font-medium text-muted-foreground text-sm"
                    onPress={() => setRevealed(false)}
                >
                    Приховати спойлер
                </Text>
            ) : (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Показати спойлер"
                    className="absolute inset-0 items-center justify-center"
                    onPress={() => setRevealed(true)}
                >
                    <View className="rounded-full bg-foreground/15 px-3.5 py-1.5">
                        <Text className="font-medium text-foreground text-xs">
                            Спойлер
                        </Text>
                    </View>
                </Pressable>
            )}
        </View>
    );
};

export default Spoiler;
