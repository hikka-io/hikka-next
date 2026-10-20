import {
    type LucideIcon,
    Meh,
    ThumbsDown,
    ThumbsUp,
} from 'lucide-react-native';

import type { Verdict } from '@hikka/core';

/** The web's verdict glyphs, shared by the composer chips and the stats card. */
export const VERDICT_ICONS: Record<Verdict, LucideIcon> = {
    yes: ThumbsUp,
    maybe: Meh,
    no: ThumbsDown,
};
