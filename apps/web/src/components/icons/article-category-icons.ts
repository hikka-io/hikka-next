import type { ComponentType } from 'react';

import { ArticleCategoryEnum } from '@hikka/api';

import MaterialSymbolsNewsmodeRounded from '@/components/icons/material-symbols/MaterialSymbolsNewsmodeRounded';
import MaterialSymbolsReviewsRounded from '@/components/icons/material-symbols/MaterialSymbolsReviewsRounded';
import MaterialSymbolsStarsRounded from '@/components/icons/material-symbols/MaterialSymbolsStarsRounded';

export const ARTICLE_CATEGORY_ICONS = {
    [ArticleCategoryEnum.NEWS]: MaterialSymbolsNewsmodeRounded,
    [ArticleCategoryEnum.SYSTEM]: null,
    [ArticleCategoryEnum.REVIEWS]: MaterialSymbolsReviewsRounded,
    [ArticleCategoryEnum.ORIGINAL]: MaterialSymbolsStarsRounded,
} as const satisfies Record<
    ArticleCategoryEnum,
    ComponentType<{ className?: string }> | null
>;
