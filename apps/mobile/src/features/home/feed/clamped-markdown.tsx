import { type FC, useState } from 'react';

import { Pressable, View } from 'react-native';

import { MDViewer } from '@/components/markdown';
import { Text } from '@/components/ui/text';

const MAX_HEIGHT = 132;

type Props = {
    children: string;
    onReadMore: () => void;
};

const ClampedMarkdown: FC<Props> = ({ children, onReadMore }) => {
    const [height, setHeight] = useState(0);
    const clamped = height > MAX_HEIGHT;

    return (
        <View className="gap-1">
            <View style={{ maxHeight: MAX_HEIGHT, overflow: 'hidden' }}>
                <View
                    onLayout={(event) =>
                        setHeight(event.nativeEvent.layout.height)
                    }
                >
                    <MDViewer
                        key={children}
                        textClassName="text-[15px] leading-[22px] text-foreground"
                    >
                        {children}
                    </MDViewer>
                </View>
            </View>
            {clamped && (
                <Pressable
                    accessibilityRole="link"
                    onPress={onReadMore}
                    className="min-h-11 justify-center self-start active:opacity-70"
                >
                    <Text className="text-primary-foreground text-sm">
                        Читати далі
                    </Text>
                </Pressable>
            )}
        </View>
    );
};

export default ClampedMarkdown;
