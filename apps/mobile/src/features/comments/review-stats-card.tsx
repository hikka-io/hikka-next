import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

import type { ReviewStatsResponse } from '@hikka/api';
import {
    getReviewTotal,
    getReviewVerdict,
    REVIEW_VERDICT_OPTIONS,
    type Verdict,
} from '@hikka/core';

import Card from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import SegmentedBar from '@/components/ui/segmented-bar';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';

import { VERDICT_ICONS } from './review-verdicts';

const BAR_CLASS: Record<Verdict, string> = {
    yes: 'bg-success-foreground',
    maybe: 'bg-warning-foreground',
    no: 'bg-destructive-foreground',
};

const ACTIVE_CLASS: Record<Verdict, string> = {
    yes: 'border-success-foreground/40 bg-success-foreground/15',
    maybe: 'border-warning-foreground/40 bg-warning-foreground/15',
    no: 'border-destructive-foreground/40 bg-destructive-foreground/15',
};

const ACTIVE_TEXT: Record<Verdict, string> = {
    yes: 'text-success-foreground',
    maybe: 'text-warning-foreground',
    no: 'text-destructive-foreground',
};

type Props = {
    stats: ReviewStatsResponse;
    value: Verdict | null;
    onChange: (verdict: Verdict | null) => void;
};

/** The web's `ReviewStatsCard`: the verdict split, its headline and one filter chip per verdict. */
const ReviewStatsCard: FC<Props> = ({ stats, value, onChange }) => {
    const total = getReviewTotal(stats);
    const verdict = getReviewVerdict(stats);

    return (
        <Card className="gap-3 p-3">
            <View className="flex-row items-center gap-3">
                <SegmentedBar
                    className="w-24 shrink-0"
                    dimmedKey={value}
                    segments={REVIEW_VERDICT_OPTIONS.map((option) => ({
                        key: option.value,
                        count: stats[option.value] ?? 0,
                        className: BAR_CLASS[option.value],
                    }))}
                />
                <Text numberOfLines={1} className="flex-1 font-medium text-sm">
                    {verdict}
                </Text>
            </View>
            <View className="flex-row gap-2">
                {REVIEW_VERDICT_OPTIONS.map(({ value: v, statsLabel }) => {
                    const count = stats[v] ?? 0;
                    const active = value === v;
                    const share =
                        total > 0 ? Math.round((count / total) * 100) : 0;

                    return (
                        <Chip
                            key={v}
                            selected={active}
                            accessibilityLabel={`${statsLabel}: ${count}, ${share}%`}
                            containerClassName="flex-1"
                            className={cn(
                                'w-full justify-center border',
                                active
                                    ? ACTIVE_CLASS[v]
                                    : 'border-transparent bg-secondary/40',
                            )}
                            textClassName={cn(
                                'tabular-nums',
                                active
                                    ? ACTIVE_TEXT[v]
                                    : 'text-muted-foreground',
                            )}
                            onPress={() => {
                                void Haptics.selectionAsync();
                                onChange(active ? null : v);
                            }}
                        >
                            <Icon as={VERDICT_ICONS[v]} />
                            {count}
                        </Chip>
                    );
                })}
            </View>
        </Card>
    );
};

export default ReviewStatsCard;
