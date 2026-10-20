import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { ScrollView, View } from 'react-native';

import { USER_LIST_ALL_STATUS } from '@hikka/core';

import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import {
    countsOf,
    STATUS_DOT,
    statusLabel,
    statusOrder,
    totalCount,
} from '../list-status';
import { type ListContentType, userListStatsOptions } from '../queries';

type ChipProps = {
    label: string;
    dot: string;
    count?: number;
    selected: boolean;
    onPress: () => void;
};

const StatusChip: FC<ChipProps> = ({
    label,
    dot,
    count,
    selected,
    onPress,
}) => (
    <Chip
        selected={selected}
        accessibilityLabel={count === undefined ? label : `${label}, ${count}`}
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
    const { data } = useQuery(userListStatsOptions(username, contentType));
    const counts = data ? countsOf(data) : undefined;
    const select = (next: string) => {
        if (next === status) return;
        void Haptics.selectionAsync();
        onStatusChange(next);
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4"
        >
            <StatusChip
                label="Усе"
                dot="bg-foreground"
                count={counts ? totalCount(contentType, counts) : undefined}
                selected={status === USER_LIST_ALL_STATUS}
                onPress={() => select(USER_LIST_ALL_STATUS)}
            />
            {statusOrder(contentType).map((value) => (
                <StatusChip
                    key={value}
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
