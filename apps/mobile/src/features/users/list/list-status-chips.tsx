import { type FC, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useIsFocused } from 'expo-router';
import { type LayoutRectangle, ScrollView, View } from 'react-native';

import { USER_LIST_ALL_STATUS } from '@hikka/core';

import { STATUS_DOT } from '@/components/tracking';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import { countsOf, statusLabel, statusOrder, totalCount } from '../list-status';
import { type ListContentType, userListStatsOptions } from '../queries';

type ChipProps = {
    onLayout: (layout: LayoutRectangle) => void;
    label: string;
    dot: string;
    count?: number;
    selected: boolean;
    onPress: () => void;
};

const StatusChip: FC<ChipProps> = ({
    onLayout,
    label,
    dot,
    count,
    selected,
    onPress,
}) => (
    <View onLayout={(event) => onLayout(event.nativeEvent.layout)}>
        <Chip
            selected={selected}
            accessibilityLabel={
                count === undefined ? label : `${label}, ${count}`
            }
            onPress={onPress}
        >
            <View className={cn('size-2 rounded-full', dot)} />
            {label}
            {count !== undefined ? (
                <Text
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="tabular-nums opacity-60"
                >
                    {count}
                </Text>
            ) : null}
        </Chip>
    </View>
);

type Props = {
    username: string;
    contentType: ListContentType;
    status: string;
    onStatusChange: (status: string) => void;
};

/** The web's status select as a chip row (`ChipTabs`), counts from the list stats. */
const ListStatusChips: FC<Props> = ({
    username,
    contentType,
    status,
    onStatusChange,
}) => {
    const { data } = useQuery({
        ...userListStatsOptions(username, contentType),
        subscribed: useIsFocused(),
    });
    const counts = data ? countsOf(data) : undefined;
    const scrollRef = useRef<ScrollView>(null);
    const layouts = useRef<Record<string, LayoutRectangle>>({});
    const [viewport, setViewport] = useState(0);
    const revealed = useRef(false);

    // Centres the chip when it fits, otherwise keeps its start in view; only a change animates.
    const reveal = (value: string) => {
        const layout = layouts.current[value];
        if (!layout || viewport === 0) return;
        scrollRef.current?.scrollTo({
            x: Math.max(0, layout.x - (viewport - layout.width) / 2),
            animated: revealed.current,
        });
        revealed.current = true;
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: reveals on a status or viewport change only
    useEffect(() => {
        reveal(status);
    }, [status, viewport]);

    // Counts load after the labels and widen the chips, so the selected one is revealed again.
    const chipLayout = (value: string) => (layout: LayoutRectangle) => {
        layouts.current[value] = layout;
        if (value === status) reveal(value);
    };
    const select = (next: string) => {
        if (next === status) return;
        void Haptics.selectionAsync();
        onStatusChange(next);
    };

    return (
        <ScrollView
            ref={scrollRef}
            horizontal
            onLayout={(event) => setViewport(event.nativeEvent.layout.width)}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4"
        >
            <StatusChip
                onLayout={chipLayout(USER_LIST_ALL_STATUS)}
                label="Усе"
                dot="bg-foreground"
                count={counts ? totalCount(contentType, counts) : undefined}
                selected={status === USER_LIST_ALL_STATUS}
                onPress={() => select(USER_LIST_ALL_STATUS)}
            />
            {statusOrder(contentType).map((value) => (
                <StatusChip
                    key={value}
                    onLayout={chipLayout(value)}
                    label={statusLabel(contentType, value) ?? value}
                    dot={STATUS_DOT[value]}
                    count={counts ? (counts[value] ?? 0) : undefined}
                    selected={status === value}
                    onPress={() => select(value)}
                />
            ))}
        </ScrollView>
    );
};

export default ListStatusChips;
