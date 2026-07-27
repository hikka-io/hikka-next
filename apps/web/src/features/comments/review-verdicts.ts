import { type LucideIcon, Meh, ThumbsDown, ThumbsUp } from 'lucide-react';

import type { Verdict } from './utils/review';

/**
 * The three review verdicts, in display order. The composer and the stats card
 * both read from here, so their icons and labels can't drift apart. Colours stay
 * with each consumer — an outline button and a chip tint share nothing.
 */
export const REVIEW_VERDICTS: {
    value: Verdict;
    icon: LucideIcon;
    /** First person, for the composer. */
    label: string;
    /** Third person, for the stats card. */
    statsLabel: string;
}[] = [
    {
        value: 'yes',
        icon: ThumbsUp,
        label: 'Рекомендую',
        statsLabel: 'Рекомендують',
    },
    {
        value: 'maybe',
        icon: Meh,
        label: 'Вагаюсь',
        statsLabel: 'Вагаються',
    },
    {
        value: 'no',
        icon: ThumbsDown,
        label: 'Не рекомендую',
        statsLabel: 'Не рекомендують',
    },
];
