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

type Rgba = [number, number, number, number];

const parseHex = (color: unknown): Rgba | null => {
    if (
        typeof color !== 'string' ||
        !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(color)
    ) {
        return null;
    }
    const channel = (start: number) =>
        Number.parseInt(color.slice(start, start + 2), 16);
    return [
        channel(1),
        channel(3),
        channel(5),
        color.length === 9 ? channel(7) / 255 : 1,
    ];
};

// A translucent surface (the card's `bg-surface`) shows the page through it, so the
// fade has to end at the surface composited over the page background, not at its raw color.
const fadeTo = (surface: unknown, page: unknown) => {
    const top = parseHex(surface);
    const bottom = parseHex(page);
    if (!top || !bottom) return undefined;
    const [r, g, b] = [0, 1, 2].map((i) =>
        Math.round(top[i] * top[3] + bottom[i] * (1 - top[3])),
    );
    return `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, 0), rgb(${r}, ${g}, ${b}))`;
};

const TextExpand: FC<PropsWithChildren<Props>> = ({
    children,
    maxHeight = DEFAULT_MAX_HEIGHT,
    surfaceClassName = 'bg-background',
}) => {
    const { backgroundColor: surface } = useResolveClassNames(surfaceClassName);
    const { backgroundColor: page } = useResolveClassNames('bg-background');
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
                            experimental_backgroundImage: fadeTo(surface, page),
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
