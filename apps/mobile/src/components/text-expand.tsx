import type { FC, PropsWithChildren } from 'react';

import { useRecyclingState } from '@shopify/flash-list';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { useResolveClassNames } from 'uniwind';

import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';

const DEFAULT_LINES = 5;
const DEFAULT_TEXT_CLASS = 'text-base leading-6';
const FADE_HEIGHT = 48;
const EXPAND_TEXT = 'Показати більше...';
const COLLAPSE_TEXT = 'Згорнути...';

type Props = {
    // Clamp to this many lines of `textClassName`, scaled with Dynamic Type.
    lines?: number;
    // The text style of the content; only its line height is read.
    textClassName?: string;
    // A fixed clamp for content that is not running text (the links card); wins over `lines`.
    maxHeight?: number;
    // The surface the content sits on, so the fade ends at the colour the eye sees.
    surfaceClassName?: string;
    // Resets the clamp when a recycled list cell or a reused screen shows other content.
    contentKey?: string;
    expandText?: string;
    expandLabel?: string;
    // The feed opens the thread instead of expanding in place.
    onReadMore?: () => void;
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
    lines = DEFAULT_LINES,
    textClassName = DEFAULT_TEXT_CLASS,
    maxHeight,
    surfaceClassName = 'bg-background',
    contentKey,
    expandText = EXPAND_TEXT,
    expandLabel,
    onReadMore,
}) => {
    const { fontScale } = useWindowDimensions();
    const { lineHeight } = useResolveClassNames(textClassName);
    const { backgroundColor: surface } = useResolveClassNames(surfaceClassName);
    const { backgroundColor: page } = useResolveClassNames('bg-background');
    const [expanded, setExpanded] = useRecyclingState(false, [contentKey]);
    const [contentHeight, setContentHeight] = useRecyclingState(0, [
        contentKey,
    ]);

    const line = (typeof lineHeight === 'number' ? lineHeight : 24) * fontScale;
    const clampHeight = maxHeight ?? lines * line;
    // Sub-point rounding of the measured height never counts as overflow.
    const needsExpansion = contentHeight > clampHeight + 1;
    const collapsed = needsExpansion && (!expanded || !!onReadMore);

    return (
        <View>
            <View
                className="overflow-hidden"
                style={collapsed ? { maxHeight: clampHeight } : undefined}
                accessibilityElementsHidden={collapsed}
                importantForAccessibility={
                    collapsed ? 'no-hide-descendants' : 'auto'
                }
            >
                <View
                    // A recycled cell keeps its frame, so onLayout would not fire again: remount to re-measure.
                    key={contentKey}
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
                            height: Math.min(FADE_HEIGHT, clampHeight / 2),
                            experimental_backgroundImage: fadeTo(surface, page),
                        }}
                    />
                )}
            </View>
            {needsExpansion && (
                <Pressable
                    accessibilityRole={onReadMore ? 'link' : 'button'}
                    accessibilityLabel={
                        expanded && !onReadMore
                            ? 'Згорнути текст'
                            : (expandLabel ?? 'Показати повний текст')
                    }
                    accessibilityState={onReadMore ? undefined : { expanded }}
                    onPress={() =>
                        onReadMore ? onReadMore() : setExpanded(!expanded)
                    }
                    className="min-h-11 min-w-11 justify-center self-start active:opacity-70"
                >
                    <Text
                        className={cn(
                            'text-sm',
                            onReadMore
                                ? 'text-primary-foreground'
                                : 'font-medium text-muted-foreground',
                        )}
                    >
                        {expanded && !onReadMore ? COLLAPSE_TEXT : expandText}
                    </Text>
                </Pressable>
            )}
        </View>
    );
};

export default TextExpand;
