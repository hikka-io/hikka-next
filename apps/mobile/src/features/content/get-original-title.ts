import { ContentTypeEnum } from '@hikka/api';

import type { ContentInfo } from './queries';

export const getOriginalTitle = (content: ContentInfo): string | null =>
    content.data_type === ContentTypeEnum.ANIME
        ? content.title_ja
        : content.title_original;
