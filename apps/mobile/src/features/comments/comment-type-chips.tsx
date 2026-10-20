import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

import type { CommentTypeEnum } from '@hikka/api';

import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';

const OPTIONS: { value: CommentTypeEnum; label: string }[] = [
    { value: 'all', label: 'Усі' },
    { value: 'comment', label: 'Коментарі' },
    { value: 'review', label: 'Відгуки' },
];

type Props = {
    value: CommentTypeEnum;
    onChange: (value: CommentTypeEnum) => void;
    /** All comments, reviews included (`comments_count`). */
    commentsCount?: number;
    reviewsCount?: number;
};

/** The web's comment-type `ChipTabs` with counts. */
const CommentTypeChips: FC<Props> = ({
    value,
    onChange,
    commentsCount,
    reviewsCount = 0,
}) => {
    const counts: Record<CommentTypeEnum, number> | undefined =
        commentsCount === undefined
            ? undefined
            : {
                  all: commentsCount,
                  comment: Math.max(commentsCount - reviewsCount, 0),
                  review: reviewsCount,
              };

    return (
        <View className="flex-row flex-wrap gap-x-2">
            {OPTIONS.map((option) => {
                const selected = option.value === value;

                return (
                    <Chip
                        key={option.value}
                        selected={selected}
                        className={selected ? undefined : 'bg-secondary'}
                        onPress={() => {
                            if (selected) return;
                            void Haptics.selectionAsync();
                            onChange(option.value);
                        }}
                    >
                        {option.label}
                        {counts && (
                            <Text className="text-muted-foreground tabular-nums">
                                {counts[option.value]}
                            </Text>
                        )}
                    </Chip>
                );
            })}
        </View>
    );
};

export default CommentTypeChips;
