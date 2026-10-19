import { Globe, Lock, type LucideIcon, UserRound } from 'lucide-react';

import { CollectionVisibilityEnum } from '@hikka/api';

export const COLLECTION_VISIBILITY_ICONS = {
    [CollectionVisibilityEnum.PUBLIC]: Globe,
    [CollectionVisibilityEnum.PRIVATE]: Lock,
    [CollectionVisibilityEnum.UNLISTED]: UserRound,
} as const satisfies Record<CollectionVisibilityEnum, LucideIcon>;
