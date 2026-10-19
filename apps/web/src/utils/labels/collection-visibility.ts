import { CollectionVisibilityEnum } from '@hikka/api';

export const COLLECTION_VISIBILITY = {
    [CollectionVisibilityEnum.PUBLIC]: { label: 'Публічна' },
    [CollectionVisibilityEnum.PRIVATE]: { label: 'Приватна' },
    [CollectionVisibilityEnum.UNLISTED]: { label: 'Лише у профілі' },
} as const satisfies Record<CollectionVisibilityEnum, { label: string }>;
