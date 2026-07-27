import { type LucideIcon, Meh, ThumbsDown, ThumbsUp } from 'lucide-react';

import type { Verdict } from './utils/review';

/**
 * The three review verdicts, in display order. Single source of truth for which
 * verdicts exist, what they are called and which icon stands for each — the
 * composer (`comment-verdict-picker`) and the stats card both read from here so
 * the two can't drift apart.
 *
 * Colours deliberately stay with each consumer: Tailwind needs static class
 * strings, and an outline button and a chip tint at different opacities.
 */
export const REVIEW_VERDICTS: {
    value: Verdict;
    icon: LucideIcon;
    /** First person — the composer, where you cast your own verdict. */
    label: string;
    /** Third person — the stats card, reporting what everyone else said. */
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
