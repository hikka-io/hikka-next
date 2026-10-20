import { type FC, type PropsWithChildren, useState } from 'react';

import { Pressable, View } from 'react-native';
import { useResolveClassNames } from 'uniwind';

import { Text } from '@/components/ui/text';

const DEFAULT_MAX_HEIGHT = 208;
const EXPAND_TEXT = 'Показати більше...';
const COLLAPSE_TEXT = 'Згорнути...';

const FADE_HEIGHT = 48;

type Props = {
    maxHeight?: number;
    surfaceClassName?: string;
};

const fadeTo = (color: unknown) => {
    if (
        typeof color !== 'string' ||
        !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(color)
    ) {
        return undefined;
    }
    const opaque = color.slice(0, 7);
    return `linear-gradient(to bottom, ${opaque}00, ${opaque})`;
};

const TextExpand: FC<PropsWithChildren<Props>> = ({
    children,
    maxHeight = DEFAULT_MAX_HEIGHT,
    surfaceClassName = 'bg-background',
}) => {
    const { backgroundColor } = useResolveClassNames(surfaceClassName);
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const needsExpansion = contentHeight > maxHeight;
    const collapsed = needsExpansion && !expanded;

    return (
        <View>
            <View
                className="overflow-hidden"
                style={collapsed ? { maxHeight } : undefined}
            >
                <View
                    onLayout={(event) =>
                        setContentHeight(event.nativeEvent.layout.height)
                    }
                >
                    {children}
                </View>
                {collapsed && (
                    <View
                        pointerEvents="none"
                        className="absolute inset-x-0 bottom-0"
                        style={{
                            height: FADE_HEIGHT,
                            experimental_backgroundImage:
                                fadeTo(backgroundColor),
                        }}
                    />
                )}
            </View>
            {needsExpansion && (
                <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() => setExpanded(!expanded)}
                    className="min-h-11 justify-center self-start active:opacity-60"
                >
                    <Text className="font-medium text-muted-foreground text-sm">
                        {expanded ? COLLAPSE_TEXT : EXPAND_TEXT}
                    </Text>
                </Pressable>
            )}
        </View>
    );
};

export default TextExpand;
