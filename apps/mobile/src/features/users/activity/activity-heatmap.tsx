import { type FC, useMemo, useRef, useState } from 'react';

import {
    type GestureResponderEvent,
    Pressable,
    ScrollView,
    View,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

import type { ActivityResponse } from '@hikka/api';
import {
    buildActivityGrid,
    DAY_FORMS,
    formatActionCount,
    formatActivityDate,
    getDeclensionWord,
} from '@hikka/core';

import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

const CELL = 10;
const GAP = 4;
const STEP = CELL + GAP;
const WEEKDAYS = 7;
const RADIUS = 2;
/** Share of the accent drawn over the secondary fill per level, the web's `color-mix` steps. */
const LEVEL_OPACITY = [0, 0.25, 0.5, 0.75, 1] as const;
const GRID_HEIGHT = WEEKDAYS * STEP - GAP;
const PAD = 2;

type Colors = { base?: string; accent?: string; outline?: string };

const asColor = (value: unknown) =>
    typeof value === 'string' ? value : undefined;

type CellProps = Colors & { x: number; y: number; level: number };

const Cell: FC<CellProps> = ({ x, y, level, base, accent }) => (
    <>
        <Rect x={x} y={y} width={CELL} height={CELL} rx={RADIUS} fill={base} />
        {level > 0 && (
            <Rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={RADIUS}
                fill={accent}
                fillOpacity={LEVEL_OPACITY[level]}
            />
        )}
    </>
);

const Legend: FC<Colors> = ({ base, accent }) => (
    <View className="flex-row items-center gap-1">
        <Text
            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
            className="text-muted-foreground text-xs"
        >
            Менше
        </Text>
        <Svg width={LEVEL_OPACITY.length * STEP - GAP} height={CELL}>
            {LEVEL_OPACITY.map((_, level) => (
                <Cell
                    key={level}
                    x={level * STEP}
                    y={0}
                    level={level}
                    base={base}
                    accent={accent}
                />
            ))}
        </Svg>
        <Text
            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
            className="text-muted-foreground text-xs"
        >
            Більше
        </Text>
    </View>
);

type Props = {
    activity: ActivityResponse[];
};

/**
 * The web's year of activity: one column per week, Monday first, the newest week at the
 * right edge. Tapping a day names its actions and date under the grid.
 */
const ActivityHeatmap: FC<Props> = ({ activity }) => {
    const [base, accent, outline] = useCSSVariable([
        '--color-secondary',
        '--color-primary-foreground',
        '--color-foreground',
    ]).map(asColor);
    const scroll = useRef<ScrollView>(null);
    const [cell, setCell] = useState<{ week: number; weekday: number } | null>(
        null,
    );
    const { weeks, total, activeDays } = useMemo(
        () => buildActivityGrid(activity),
        [activity],
    );
    const width = weeks.length * STEP - GAP;

    const select = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        const week = Math.floor((locationX - PAD) / STEP);
        const weekday = Math.floor((locationY - PAD) / STEP);
        setCell(weeks[week]?.[weekday] ? { week, weekday } : null);
    };

    const summary =
        total > 0
            ? `${formatActionCount(total)} за рік, ${activeDays} ${getDeclensionWord(activeDays, DAY_FORMS)} з активністю`
            : 'Немає активності за рік';
    const selected = cell ? weeks[cell.week]?.[cell.weekday] : null;
    const caption = selected
        ? `${selected.actions > 0 ? formatActionCount(selected.actions) : 'Немає активності'} · ${formatActivityDate(selected.date)}`
        : summary;

    return (
        <View className="gap-3">
            <ScrollView
                ref={scroll}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                }}
                onContentSizeChange={() =>
                    scroll.current?.scrollToEnd({ animated: false })
                }
            >
                <Pressable
                    accessibilityRole="image"
                    accessibilityLabel={`Активність: ${summary}`}
                    accessibilityHint="Торкніться дня, щоб побачити кількість дій"
                    onPress={select}
                >
                    <Svg width={width + PAD * 2} height={GRID_HEIGHT + PAD * 2}>
                        {weeks.map((week, weekIndex) =>
                            week.map((day, weekday) =>
                                day ? (
                                    <Cell
                                        // biome-ignore lint/suspicious/noArrayIndexKey: the grid is positional
                                        key={`${weekIndex}:${weekday}`}
                                        x={PAD + weekIndex * STEP}
                                        y={PAD + weekday * STEP}
                                        level={day.level}
                                        base={base}
                                        accent={accent}
                                    />
                                ) : null,
                            ),
                        )}
                        {cell && selected ? (
                            <Rect
                                x={PAD + cell.week * STEP - 1}
                                y={PAD + cell.weekday * STEP - 1}
                                width={CELL + 2}
                                height={CELL + 2}
                                rx={RADIUS + 1}
                                fill="none"
                                stroke={outline}
                                strokeWidth={1.5}
                            />
                        ) : null}
                    </Svg>
                </Pressable>
            </ScrollView>
            <View className="flex-row items-center justify-between gap-3">
                <Text
                    numberOfLines={2}
                    accessibilityLiveRegion="polite"
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="min-w-0 flex-1 text-muted-foreground text-xs"
                >
                    {caption}
                </Text>
                <Legend base={base} accent={accent} />
            </View>
        </View>
    );
};

export default ActivityHeatmap;
