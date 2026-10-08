import type { ComponentType } from 'react';

import { MessageCircle } from 'lucide-react';

import { ContentTypeEnum } from '@hikka/api';

import MaterialSymbolsAccountBox from '@/components/icons/material-symbols/MaterialSymbolsAccountBox';
import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsFace3 from '@/components/icons/material-symbols/MaterialSymbolsFace3';
import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';

export const CONTENT_TYPE_ICONS = {
    [ContentTypeEnum.ANIME]: MaterialSymbolsAnimatedImages,
    [ContentTypeEnum.MANGA]: MaterialSymbolsPalette,
    [ContentTypeEnum.NOVEL]: MaterialSymbolsMenuBookRounded,
    [ContentTypeEnum.CHARACTER]: MaterialSymbolsFace3,
    [ContentTypeEnum.PERSON]: MaterialSymbolsPerson,
    [ContentTypeEnum.COLLECTION]: MaterialSymbolsStack,
    [ContentTypeEnum.ARTICLE]: MaterialSymbolsDynamicFeedRounded,
    [ContentTypeEnum.COMMENT]: MessageCircle,
    [ContentTypeEnum.EDIT]: MaterialSymbolsEditRounded,
    [ContentTypeEnum.USER]: MaterialSymbolsAccountBox,
    [ContentTypeEnum.HISTORY]: MaterialSymbolsHistoryRounded,
} as const satisfies Record<
    ContentTypeEnum,
    ComponentType<{ className?: string }>
>;
