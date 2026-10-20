import { type LucideIcon, Meh, ThumbsDown, ThumbsUp } from 'lucide-react';

import { REVIEW_VERDICT_OPTIONS, type Verdict } from '@hikka/core';

const VERDICT_ICONS: Record<Verdict, LucideIcon> = {
    yes: ThumbsUp,
    maybe: Meh,
    no: ThumbsDown,
};

/**
 * The three review verdicts, in display order. The composer and the stats card
 * both read from here, so their icons and labels can't drift apart. Colours stay
 * with each consumer — an outline button and a chip tint share nothing.
 */
export const REVIEW_VERDICTS = REVIEW_VERDICT_OPTIONS.map((option) => ({
    ...option,
    icon: VERDICT_ICONS[option.value],
}));
