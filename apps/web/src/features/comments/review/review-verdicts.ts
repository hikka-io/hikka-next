import { type LucideIcon, Meh, ThumbsDown, ThumbsUp } from 'lucide-react';

import { ReviewRecommendedEnum } from '@hikka/api';

/**
 * The three review verdicts, in display order. The composer and the stats card
 * both read from here, so their icons and labels can't drift apart. Colours stay
 * with each consumer — an outline button and a chip tint share nothing.
 */
export const REVIEW_VERDICTS: {
    value: ReviewRecommendedEnum;
    icon: LucideIcon;
    /** First person, for the composer. */
    label: string;
    /** Third person, for the stats card. */
    statsLabel: string;
}[] = [
    {
        value: ReviewRecommendedEnum.YES,
        icon: ThumbsUp,
        label: 'Рекомендую',
        statsLabel: 'Рекомендують',
    },
    {
        value: ReviewRecommendedEnum.MAYBE,
        icon: Meh,
        label: 'Вагаюсь',
        statsLabel: 'Вагаються',
    },
    {
        value: ReviewRecommendedEnum.NO,
        icon: ThumbsDown,
        label: 'Не рекомендую',
        statsLabel: 'Не рекомендують',
    },
];
