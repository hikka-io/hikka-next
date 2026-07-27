import { ContentTypeEnum } from '@hikka/api';

import {
    getTitle,
    type NameLanguage,
    type TitleLanguage,
} from '@/utils/title/get-title';

/**
 * `getTitle` handles none of these: collections/articles carry a plain `title`,
 * users a `username`, edits only an id.
 */
export default function getContentTitle(
    content_type: ContentTypeEnum,
    content: Record<string, unknown> | object | null | undefined,
    titleLang?: TitleLanguage,
    nameLang?: NameLanguage,
): string {
    if (!content) return '';

    const record = content as Record<string, unknown>;

    switch (content_type) {
        case ContentTypeEnum.COLLECTION:
        case ContentTypeEnum.ARTICLE:
            return typeof record.title === 'string' ? record.title : '';
        case ContentTypeEnum.EDIT:
            return record.edit_id ? `Правка #${record.edit_id}` : '';
        case ContentTypeEnum.USER:
            return typeof record.username === 'string' ? record.username : '';
        default:
            return getTitle(content, titleLang, nameLang);
    }
}
