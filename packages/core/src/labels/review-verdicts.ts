import { ReviewRecommendedEnum } from '@hikka/api';

import type { Verdict } from '../review';

/** The three review verdicts in display order: first person for the composer, third person for the stats card. */
export const REVIEW_VERDICT_OPTIONS: readonly {
    value: Verdict;
    label: string;
    statsLabel: string;
}[] = [
    {
        value: ReviewRecommendedEnum.YES,
        label: 'Рекомендую',
        statsLabel: 'Рекомендують',
    },
    {
        value: ReviewRecommendedEnum.MAYBE,
        label: 'Вагаюсь',
        statsLabel: 'Вагаються',
    },
    {
        value: ReviewRecommendedEnum.NO,
        label: 'Не рекомендую',
        statsLabel: 'Не рекомендують',
    },
];
