import type { FC } from 'react';

import { View } from 'react-native';

import type { ReviewResponse } from '@hikka/api';

import { Badge } from '@/components/ui/badge';

const VERDICTS = {
    yes: { label: 'Рекомендує', variant: 'success' },
    no: { label: 'Не рекомендує', variant: 'destructive' },
    maybe: { label: 'Вагається', variant: 'warning' },
} as const;

type Props = {
    review: ReviewResponse;
};

const ReviewBadge: FC<Props> = ({ review }) => {
    const verdict = VERDICTS[review.recommended];

    return (
        <View className="flex-row items-center gap-1">
            <Badge variant={verdict.variant}>{verdict.label}</Badge>
            {!!review.score && (
                <Badge variant={verdict.variant}>{review.score}</Badge>
            )}
        </View>
    );
};

export default ReviewBadge;
