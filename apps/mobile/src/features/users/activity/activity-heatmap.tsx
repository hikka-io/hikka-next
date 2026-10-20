import { type FC, useMemo, useRef, useState } from 'react';

import {
    type AccessibilityActionEvent,
    type GestureResponderEvent,
    type LayoutChangeEvent,
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

import { mixHex } from './mix-color';

const CELL = 10;
const GAP = 4;
const STEP = CELL + GAP;
const WEEKDAYS = 7;
const RADIUS = 2;
/** Share of the accent over the secondary fill per level, the web's `color-mix` steps. */
const LEVEL_MIX = [0, 0.25, 0.5, 0.75, 1] as const;
const GRID_HEIGHT = WEEKDAYS * STEP - GAP;
const PAD = 2;

const ACTIONS = [
    { name: 'decrement', label: 'Попередній день' },
    { name: 'increment', label: 'Наступний день' },
];

type Position = { week: number; weekday: number };

const asColor = (value: unknown) =>
    typeof value === 'string' ? value : undefined;

type LegendProps = { colors: (string | undefined)[] };

const Legend: FC<LegendProps> = ({ colors }) => (
    <View className="flex-row items-center gap-1">
        <Text
            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
            className="text-muted-foreground text-xs"
        >
            Менше
        </Text>
        <Svg width={LEVEL_MIX.length * STEP - GAP} height={CELL}>
            {colors.map((fill, level) => (
                <Rect
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed five levels
                    key={level}
                    x={level * STEP}
                    width={CELL}
                    height={CELL}
                    rx={RADIUS}
                    fill={fill}
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
 * right edge. Tapping a day names its actions and date under the grid; for a screen reader
 * the grid is one adjustable element that steps through the days.
 */
const ActivityHeatmap: FC<Props> = ({ activity }) => {
    const [base, accent, outline] = useCSSVariable([
        '--color-secondary',
        '--color-primary-foreground',
        '--color-foreground',
    ]).map(asColor);
    const scroll = useRef<ScrollView>(null);
    const viewport = useRef({ offset: 0, width: 0 });
    const [cell, setCell] = useState<Position | null>(null);
    const { weeks, total, activeDays } = useMemo(
        () => buildActivityGrid(activity),
        [activity],
    );
    const colors = useMemo(
        () =>
            LEVEL_MIX.map((amount) =>
                base && accent ? mixHex(base, accent, amount) : base,
            ),
        [base, accent],
    );
    const days = useMemo(
        () =>
            weeks.flatMap((week, weekIndex) =>
                week.flatMap((day, weekday) =>
                    day ? [{ week: weekIndex, weekday }] : [],
                ),
            ),
        [weeks],
    );
    const width = weeks.length * STEP - GAP;

    const select = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        const week = Math.floor((locationX - PAD) / STEP);
        const weekday = Math.floor((locationY - PAD) / STEP);
        setCell(weeks[week]?.[weekday] ? { week, weekday } : null);
    };

    const step = ({ nativeEvent }: AccessibilityActionEvent) => {
        const current = cell
            ? days.findIndex(
                  (day) =>
                      day.week === cell.week && day.weekday === cell.weekday,
              )
            : -1;
        const delta = nativeEvent.actionName === 'increment' ? 1 : -1;
        const next =
            current < 0
                ? days.length - 1
                : Math.min(days.length - 1, Math.max(0, current + delta));
        const target = days[next];
        if (!target) return;

        setCell(target);
        const x = PAD + target.week * STEP;
        const { offset, width: visible } = viewport.current;
        if (x < offset || x + CELL > offset + visible) {
            scroll.current?.scrollTo({
                x: Math.max(0, x - visible / 2),
                animated: false,
            });
        }
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
                scrollEventThrottle={32}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                }}
                onLayout={(event: LayoutChangeEvent) => {
                    viewport.current.width = event.nativeEvent.layout.width;
                }}
                onScroll={(event) => {
                    viewport.current.offset = event.nativeEvent.contentOffset.x;
                }}
                onContentSizeChange={() =>
                    scroll.current?.scrollToEnd({ animated: false })
                }
            >
                <Pressable
                    accessible
                    accessibilityRole="adjustable"
                    accessibilityLabel={`Активність: ${summary}`}
                    accessibilityHint="Проведіть вгору або вниз, щоб перейти до іншого дня"
                    accessibilityValue={{
                        text: selected ? caption : undefined,
                    }}
                    accessibilityActions={ACTIONS}
                    onAccessibilityAction={step}
                    onPress={select}
                >
                    <Svg width={width + PAD * 2} height={GRID_HEIGHT + PAD * 2}>
                        {weeks.map((week, weekIndex) =>
                            week.map((day, weekday) =>
                                day ? (
                                    <Rect
                                        // biome-ignore lint/suspicious/noArrayIndexKey: the grid is positional
                                        key={`${weekIndex}:${weekday}`}
                                        x={PAD + weekIndex * STEP}
                                        y={PAD + weekday * STEP}
                                        width={CELL}
                                        height={CELL}
                                        rx={RADIUS}
                                        fill={colors[day.level]}
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
                    accessibilityElementsHidden
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="min-w-0 flex-1 text-muted-foreground text-xs"
                >
                    {caption}
                </Text>
                <Legend colors={colors} />
            </View>
        </View>
    );
};

export default ActivityHeatmap;
